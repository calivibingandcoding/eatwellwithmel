import { correlationService } from '../correlationService';
import { DiaryEntry, FoodEntry, SymptomEntry } from '../../types';

describe('CorrelationService', () => {
  const mockFoodEntry: DiaryEntry = {
    id: '1',
    userId: 'user1',
    timestamp: new Date('2024-01-01T12:00:00'),
    type: 'food',
    data: {
      id: '1',
      userId: 'user1',
      foodItem: 'White Bread',
      portion: '2 slices',
      timestamp: new Date('2024-01-01T12:00:00'),
      mealType: 'lunch'
    } as FoodEntry
  };

  const mockSymptomEntry: DiaryEntry = {
    id: '2',
    userId: 'user1',
    timestamp: new Date('2024-01-01T15:00:00'), // 3 hours after food
    type: 'symptom',
    data: {
      id: '2',
      userId: 'user1',
      symptomType: 'bloating',
      severity: 7,
      timestamp: new Date('2024-01-01T15:00:00')
    } as SymptomEntry
  };

  const mockEntries: DiaryEntry[] = [mockFoodEntry, mockSymptomEntry];

  test('analyzeCorrelations returns correct structure', () => {
    const analysis = correlationService.analyzeCorrelations(mockEntries);

    expect(analysis).toHaveProperty('triggers');
    expect(analysis).toHaveProperty('timeframe');
    expect(analysis).toHaveProperty('totalEntries');
    expect(analysis).toHaveProperty('symptomEpisodes');
    expect(analysis.totalEntries).toBe(2);
    expect(analysis.symptomEpisodes).toBe(1);
  });

  test('identifies correlation within time window', () => {
    // Create multiple entries with same food triggering symptoms
    const entries: DiaryEntry[] = [];
    
    // Add multiple instances of bread followed by symptoms
    for (let i = 0; i < 5; i++) {
      const date = new Date(`2024-01-0${i + 1}T12:00:00`);
      const symptomDate = new Date(`2024-01-0${i + 1}T15:00:00`);
      
      entries.push({
        id: `food-${i}`,
        userId: 'user1',
        timestamp: date,
        type: 'food',
        data: {
          id: `food-${i}`,
          userId: 'user1',
          foodItem: 'White Bread',
          portion: '2 slices',
          timestamp: date,
          mealType: 'lunch'
        } as FoodEntry
      });

      entries.push({
        id: `symptom-${i}`,
        userId: 'user1',
        timestamp: symptomDate,
        type: 'symptom',
        data: {
          id: `symptom-${i}`,
          userId: 'user1',
          symptomType: 'bloating',
          severity: 6 + i,
          timestamp: symptomDate
        } as SymptomEntry
      });
    }

    const analysis = correlationService.analyzeCorrelations(entries);
    
    expect(analysis.triggers).toHaveLength(1);
    expect(analysis.triggers[0].item).toBe('White Bread');
    expect(analysis.triggers[0].correlationPercentage).toBe(100); // 5/5 times
    expect(analysis.triggers[0].occurrences).toBe(5);
    expect(analysis.triggers[0].totalExposures).toBe(5);
  });

  test('does not correlate symptoms outside time window', () => {
    const entries: DiaryEntry[] = [
      {
        id: 'food-1',
        userId: 'user1',
        timestamp: new Date('2024-01-01T12:00:00'),
        type: 'food',
        data: {
          id: 'food-1',
          userId: 'user1',
          foodItem: 'White Bread',
          portion: '2 slices',
          timestamp: new Date('2024-01-01T12:00:00'),
          mealType: 'lunch'
        } as FoodEntry
      },
      {
        id: 'symptom-1',
        userId: 'user1',
        timestamp: new Date('2024-01-01T20:00:00'), // 8 hours later (outside 6-hour window)
        type: 'symptom',
        data: {
          id: 'symptom-1',
          userId: 'user1',
          symptomType: 'bloating',
          severity: 7,
          timestamp: new Date('2024-01-01T20:00:00')
        } as SymptomEntry
      }
    ];

    const analysis = correlationService.analyzeCorrelations(entries);
    
    // Should not find correlation due to time window
    const breadTrigger = analysis.triggers.find(t => t.item === 'White Bread');
    expect(breadTrigger?.correlationPercentage).toBe(0);
  });

  test('generateSummaryStats calculates correct statistics', () => {
    const entries: DiaryEntry[] = [
      mockFoodEntry,
      mockSymptomEntry,
      {
        id: '3',
        userId: 'user1',
        timestamp: new Date('2024-01-02T12:00:00'),
        type: 'food',
        data: {
          id: '3',
          userId: 'user1',
          foodItem: 'Salad',
          portion: '1 bowl',
          timestamp: new Date('2024-01-02T12:00:00'),
          mealType: 'lunch'
        } as FoodEntry
      }
    ];

    const stats = correlationService.generateSummaryStats(entries);

    expect(stats.totalEntries).toBe(3);
    expect(stats.symptomEpisodes).toBe(1);
    expect(stats.trackedDays).toBe(2); // 2 different days
    expect(stats.dataCompleteness).toBeGreaterThan(0);
  });

  test('filters by symptom type correctly', () => {
    const entries: DiaryEntry[] = [
      mockFoodEntry,
      mockSymptomEntry,
      {
        id: '3',
        userId: 'user1',
        timestamp: new Date('2024-01-01T16:00:00'),
        type: 'symptom',
        data: {
          id: '3',
          userId: 'user1',
          symptomType: 'pain',
          severity: 5,
          timestamp: new Date('2024-01-01T16:00:00')
        } as SymptomEntry
      }
    ];

    const analysisAll = correlationService.analyzeCorrelations(entries);
    const analysisBloating = correlationService.analyzeCorrelations(entries, 'bloating');
    const analysisPain = correlationService.analyzeCorrelations(entries, 'pain');

    expect(analysisAll.symptomEpisodes).toBe(2);
    expect(analysisBloating.symptomEpisodes).toBe(1);
    expect(analysisPain.symptomEpisodes).toBe(1);
  });

  test('generateTrendData returns correct format', () => {
    const trends = correlationService.generateTrendData(mockEntries, 'White Bread', 'bloating', 2);

    expect(trends).toHaveLength(2); // 2 weeks
    expect(trends[0]).toHaveProperty('date');
    expect(trends[0]).toHaveProperty('symptoms');
    expect(trends[0]).toHaveProperty('item');
  });

  test('identifyHighRiskPeriods finds peak symptom hours', () => {
    const entries: DiaryEntry[] = [];
    
    // Create multiple symptoms at 3 PM
    for (let i = 0; i < 5; i++) {
      entries.push({
        id: `symptom-${i}`,
        userId: 'user1',
        timestamp: new Date(`2024-01-0${i + 1}T15:00:00`),
        type: 'symptom',
        data: {
          id: `symptom-${i}`,
          userId: 'user1',
          symptomType: 'bloating',
          severity: 6,
          timestamp: new Date(`2024-01-0${i + 1}T15:00:00`)
        } as SymptomEntry
      });
    }

    // Add one symptom at 9 AM
    entries.push({
      id: 'symptom-morning',
      userId: 'user1',
      timestamp: new Date('2024-01-06T09:00:00'),
      type: 'symptom',
      data: {
        id: 'symptom-morning',
        userId: 'user1',
        symptomType: 'bloating',
        severity: 6,
        timestamp: new Date('2024-01-06T09:00:00')
      } as SymptomEntry
    });

    const highRiskHours = correlationService.identifyHighRiskPeriods(entries);
    
    expect(highRiskHours).toContain(15); // 3 PM should be high risk
    expect(highRiskHours).not.toContain(9); // 9 AM should not be high risk
  });
});