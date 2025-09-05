import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { DiaryEntry, User, TriggerCorrelation } from '../types';
import { correlationService } from './correlationService';

export interface ExportOptions {
  includeCharts?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  symptomType?: string;
}

class ExportService {
  async exportToPDF(
    user: User,
    entries: DiaryEntry[],
    options: ExportOptions = {}
  ): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(250, 120, 136); // #fa7888
    doc.text('Eat Well With Mel - Health Report', margin, yPosition);
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient: ${user.name}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, margin, yPosition);
    yPosition += 15;

    // Date range
    if (options.dateRange) {
      doc.text(
        `Report Period: ${format(options.dateRange.start, 'MMM d, yyyy')} - ${format(options.dateRange.end, 'MMM d, yyyy')}`,
        margin,
        yPosition
      );
      yPosition += 15;
    }

    // Summary Statistics
    const stats = correlationService.generateSummaryStats(entries);
    
    doc.setFontSize(16);
    doc.setTextColor(250, 120, 136);
    doc.text('Summary Statistics', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Entries: ${stats.totalEntries}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Symptom Episodes: ${stats.symptomEpisodes}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Days Tracked: ${stats.trackedDays}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Potential Triggers Identified: ${stats.potentialTriggers}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Data Completeness: ${stats.dataCompleteness}%`, margin, yPosition);
    yPosition += 15;

    // Correlation Analysis
    const analysis = correlationService.analyzeCorrelations(
      entries, 
      options.symptomType, 
      options.dateRange ? 
        Math.ceil((options.dateRange.end.getTime() - options.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) : 
        30
    );

    if (analysis.triggers.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(250, 120, 136);
      doc.text('Potential Triggers', margin, yPosition);
      yPosition += 10;

      // Table headers
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Food/Drink Item', margin, yPosition);
      doc.text('Correlation %', margin + 80, yPosition);
      doc.text('Occurrences', margin + 130, yPosition);
      doc.text('Avg Severity', margin + 170, yPosition);
      yPosition += 8;

      // Draw line under headers
      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
      yPosition += 5;

      // Trigger data (top 10)
      analysis.triggers.slice(0, 10).forEach((trigger) => {
        if (yPosition > 270) { // Check if need new page
          doc.addPage();
          yPosition = 30;
        }

        doc.text(trigger.item.substring(0, 30), margin, yPosition); // Truncate long names
        doc.text(`${trigger.correlationPercentage}%`, margin + 80, yPosition);
        doc.text(`${trigger.occurrences}/${trigger.totalExposures}`, margin + 130, yPosition);
        doc.text(
          trigger.averageSeverity ? `${trigger.averageSeverity}/10` : 'N/A', 
          margin + 170, 
          yPosition
        );
        yPosition += 8;
      });
      
      yPosition += 10;
    }

    // Daily Entries (last 7 days)
    const recentEntries = entries
      .filter(e => {
        const daysDiff = (new Date().getTime() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (recentEntries.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setTextColor(250, 120, 136);
      doc.text('Recent Diary Entries (Last 7 Days)', margin, yPosition);
      yPosition += 15;

      const groupedEntries = this.groupEntriesByDate(recentEntries);
      
      Object.entries(groupedEntries).forEach(([date, dayEntries]) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(format(new Date(date), 'EEEE, MMMM d, yyyy'), margin, yPosition);
        yPosition += 8;

        dayEntries.forEach((entry) => {
          doc.setFontSize(9);
          const time = format(entry.timestamp, 'h:mm a');
          const description = this.getEntryDescription(entry);
          
          doc.text(`${time} - ${entry.type}: ${description}`, margin + 10, yPosition);
          yPosition += 6;
        });
        
        yPosition += 5;
      });
    }

    // Recommendations
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(250, 120, 136);
    doc.text('Recommendations', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const recommendations = this.generateRecommendations(analysis.triggers);
    recommendations.forEach((recommendation) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
      doc.text(`• ${recommendation}`, margin, yPosition);
      yPosition += 8;
    });

    // Save the PDF
    const fileName = `eat-well-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  }

  async exportToCSV(entries: DiaryEntry[]): Promise<void> {
    const csvData = entries.map((entry) => {
      const baseData = {
        Date: format(entry.timestamp, 'yyyy-MM-dd'),
        Time: format(entry.timestamp, 'HH:mm'),
        Type: entry.type,
        UserId: entry.userId
      };

      switch (entry.type) {
        case 'food':
          const foodData = entry.data as any;
          return {
            ...baseData,
            Item: foodData.foodItem,
            Brand: foodData.brandName || '',
            Portion: foodData.portion,
            MealType: foodData.mealType,
            Severity: '',
            Duration: '',
            Notes: ''
          };
        case 'drink':
          const drinkData = entry.data as any;
          return {
            ...baseData,
            Item: drinkData.drinkItem,
            Brand: drinkData.brandName || '',
            Portion: drinkData.amount,
            MealType: '',
            Severity: '',
            Duration: '',
            Notes: ''
          };
        case 'symptom':
          const symptomData = entry.data as any;
          return {
            ...baseData,
            Item: symptomData.symptomType,
            Brand: '',
            Portion: '',
            MealType: '',
            Severity: symptomData.severity,
            Duration: symptomData.duration || '',
            Notes: symptomData.customSymptom || ''
          };
        default:
          return {
            ...baseData,
            Item: '',
            Brand: '',
            Portion: '',
            MealType: '',
            Severity: '',
            Duration: '',
            Notes: ''
          };
      }
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eat-well-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private groupEntriesByDate(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
    return entries.reduce((groups, entry) => {
      const date = entry.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {} as Record<string, DiaryEntry[]>);
  }

  private getEntryDescription(entry: DiaryEntry): string {
    switch (entry.type) {
      case 'food':
        const foodData = entry.data as any;
        return `${foodData.foodItem} (${foodData.portion})`;
      case 'drink':
        const drinkData = entry.data as any;
        return `${drinkData.drinkItem} (${drinkData.amount})`;
      case 'symptom':
        const symptomData = entry.data as any;
        return `${symptomData.symptomType} (${symptomData.severity}/10)`;
      case 'exercise':
        const exerciseData = entry.data as any;
        return `${exerciseData.activityType} (${exerciseData.duration} min)`;
      case 'supplement':
        const supplementData = entry.data as any;
        return `${supplementData.supplementName} (${supplementData.dose})`;
      case 'wellness':
        const wellnessData = entry.data as any;
        return `${wellnessData.type} (${wellnessData.rating}/10)`;
      default:
        return 'Unknown entry';
    }
  }

  private generateRecommendations(triggers: TriggerCorrelation[]): string[] {
    const recommendations: string[] = [];

    if (triggers.length === 0) {
      recommendations.push('Continue tracking your food intake and symptoms to identify patterns.');
      recommendations.push('Aim for at least 3 meals per day with consistent logging.');
      return recommendations;
    }

    const highRiskTriggers = triggers.filter(t => t.correlationPercentage >= 70);
    const moderateRiskTriggers = triggers.filter(t => t.correlationPercentage >= 50 && t.correlationPercentage < 70);

    if (highRiskTriggers.length > 0) {
      recommendations.push(
        `Consider avoiding or reducing: ${highRiskTriggers.slice(0, 3).map(t => t.item).join(', ')} as they show strong correlation with symptoms.`
      );
    }

    if (moderateRiskTriggers.length > 0) {
      recommendations.push(
        `Monitor consumption of: ${moderateRiskTriggers.slice(0, 3).map(t => t.item).join(', ')} and note any symptoms.`
      );
    }

    recommendations.push('Keep a consistent eating schedule and note portion sizes.');
    recommendations.push('Share this report with your healthcare provider for personalized advice.');
    recommendations.push('Continue daily logging to improve pattern recognition accuracy.');

    return recommendations;
  }
}

export const exportService = new ExportService();