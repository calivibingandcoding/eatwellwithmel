import { 
  DiaryEntry, 
  FoodEntry, 
  DrinkEntry, 
  SymptomEntry, 
  TriggerCorrelation 
} from '../types';
import { differenceInHours, parseISO } from 'date-fns';

export interface CorrelationAnalysis {
  triggers: TriggerCorrelation[];
  timeframe: {
    start: Date;
    end: Date;
  };
  totalEntries: number;
  symptomEpisodes: number;
}

class CorrelationService {
  private readonly CORRELATION_WINDOW_HOURS = 6; // Look for correlations within 6 hours before symptoms

  analyzeCorrelations(
    entries: DiaryEntry[],
    symptomType?: string,
    timeframeDays: number = 30
  ): CorrelationAnalysis {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeframeDays);

    const filteredEntries = entries.filter(entry => 
      entry.timestamp >= startDate && entry.timestamp <= endDate
    );

    const foodAndDrinkEntries = filteredEntries.filter(entry => 
      entry.type === 'food' || entry.type === 'drink'
    );

    const symptomEntries = filteredEntries.filter(entry => {
      if (entry.type !== 'symptom') return false;
      const symptomData = entry.data as SymptomEntry;
      return symptomType ? symptomData.symptomType === symptomType : true;
    });

    const triggers = this.calculateTriggerCorrelations(
      foodAndDrinkEntries,
      symptomEntries
    );

    return {
      triggers: triggers.sort((a, b) => b.correlationPercentage - a.correlationPercentage),
      timeframe: { start: startDate, end: endDate },
      totalEntries: filteredEntries.length,
      symptomEpisodes: symptomEntries.length
    };
  }

  private calculateTriggerCorrelations(
    foodAndDrinkEntries: DiaryEntry[],
    symptomEntries: DiaryEntry[]
  ): TriggerCorrelation[] {
    const itemTracker = new Map<string, {
      totalExposures: number;
      symptomOccurrences: number;
      severitySum: number;
      severityCount: number;
      type: 'food' | 'drink';
    }>();

    // Count total exposures for each food/drink item
    foodAndDrinkEntries.forEach(entry => {
      const itemName = this.getItemName(entry);
      const itemType = entry.type as 'food' | 'drink';
      
      if (!itemTracker.has(itemName)) {
        itemTracker.set(itemName, {
          totalExposures: 0,
          symptomOccurrences: 0,
          severitySum: 0,
          severityCount: 0,
          type: itemType
        });
      }
      
      itemTracker.get(itemName)!.totalExposures++;
    });

    // For each symptom episode, check for potential triggers within the time window
    symptomEntries.forEach(symptomEntry => {
      const symptomData = symptomEntry.data as SymptomEntry;
      const symptomTime = symptomEntry.timestamp;

      // Find all food/drink entries within the correlation window before this symptom
      const potentialTriggers = foodAndDrinkEntries.filter(foodEntry => {
        const hoursDiff = differenceInHours(symptomTime, foodEntry.timestamp);
        return hoursDiff >= 0 && hoursDiff <= this.CORRELATION_WINDOW_HOURS;
      });

      // Track which items were consumed before this symptom
      const triggersForThisSymptom = new Set<string>();
      
      potentialTriggers.forEach(triggerEntry => {
        const itemName = this.getItemName(triggerEntry);
        triggersForThisSymptom.add(itemName);
      });

      // Update correlation counts for each trigger
      triggersForThisSymptom.forEach(itemName => {
        const tracker = itemTracker.get(itemName);
        if (tracker) {
          tracker.symptomOccurrences++;
          tracker.severitySum += symptomData.severity;
          tracker.severityCount++;
        }
      });
    });

    // Convert to TriggerCorrelation objects and filter out items with low exposure
    const correlations: TriggerCorrelation[] = [];
    
    itemTracker.forEach((tracker, itemName) => {
      // Only include items that have been consumed at least 3 times
      if (tracker.totalExposures >= 3) {
        const correlationPercentage = Math.round(
          (tracker.symptomOccurrences / tracker.totalExposures) * 100
        );
        
        const averageSeverity = tracker.severityCount > 0 
          ? Math.round(tracker.severitySum / tracker.severityCount) 
          : undefined;

        correlations.push({
          item: itemName,
          itemType: tracker.type,
          symptom: 'any', // This would be more specific in a real implementation
          correlationPercentage,
          occurrences: tracker.symptomOccurrences,
          totalExposures: tracker.totalExposures,
          averageSeverity
        });
      }
    });

    return correlations;
  }

  private getItemName(entry: DiaryEntry): string {
    switch (entry.type) {
      case 'food':
        const foodData = entry.data as FoodEntry;
        return foodData.foodItem;
      case 'drink':
        const drinkData = entry.data as DrinkEntry;
        return drinkData.drinkItem;
      default:
        return 'Unknown';
    }
  }

  generateTrendData(
    entries: DiaryEntry[],
    itemName: string,
    symptomType: string,
    weeks: number = 4
  ) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (weeks * 7));

    const trendData = [];
    
    for (let week = 0; week < weeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekEntries = entries.filter(entry => 
        entry.timestamp >= weekStart && entry.timestamp < weekEnd
      );

      const itemConsumption = weekEntries.filter(entry => {
        if (entry.type !== 'food' && entry.type !== 'drink') return false;
        return this.getItemName(entry) === itemName;
      }).length;

      const symptomOccurrences = weekEntries.filter(entry => {
        if (entry.type !== 'symptom') return false;
        const symptomData = entry.data as SymptomEntry;
        return symptomData.symptomType === symptomType;
      }).length;

      trendData.push({
        date: `Week ${week + 1}`,
        symptoms: symptomOccurrences,
        item: itemConsumption
      });
    }

    return trendData;
  }

  generateSummaryStats(entries: DiaryEntry[]) {
    const totalEntries = entries.length;
    const symptomEntries = entries.filter(e => e.type === 'symptom').length;
    const uniqueDays = new Set(
      entries.map(e => e.timestamp.toDateString())
    ).size;

    // Calculate potential triggers (items with correlation > 50%)
    const analysis = this.analyzeCorrelations(entries);
    const potentialTriggers = analysis.triggers.filter(t => t.correlationPercentage > 50).length;

    const dataCompleteness = Math.min(100, Math.round((totalEntries / (uniqueDays * 4)) * 100)); // Assuming 4 entries per day is complete

    return {
      totalEntries,
      symptomEpisodes: symptomEntries,
      potentialTriggers,
      trackedDays: uniqueDays,
      dataCompleteness
    };
  }

  identifyHighRiskPeriods(entries: DiaryEntry[]) {
    const hourlySymptoms = new Array(24).fill(0);
    
    entries
      .filter(e => e.type === 'symptom')
      .forEach(entry => {
        const hour = entry.timestamp.getHours();
        hourlySymptoms[hour]++;
      });

    const maxSymptoms = Math.max(...hourlySymptoms);
    const highRiskHours = hourlySymptoms
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > maxSymptoms * 0.7) // Hours with 70%+ of max symptoms
      .map(({ hour }) => hour);

    return highRiskHours;
  }
}

export const correlationService = new CorrelationService();