import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { FileDownload, Refresh } from '@mui/icons-material';
import { CorrelationService } from '../../services/correlationService';
import { DiaryEntry, FoodEntry, SymptomEntry } from '../../types';

interface TriggerData {
  item: string;
  correlation: number;
  exposure: number;
  occurrences: string;
}

interface TrendData {
  date: string;
  symptoms: number;
  item: number;
}

export const ReportsPage: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('bloating');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [triggerData, setTriggerData] = useState<TriggerData[]>([]);
  const [analysisData, setAnalysisData] = useState<{
    totalEntries: number;
    symptomEpisodes: number;
    potentialTriggers: number;
    dataCompleteness: number;
  }>({ totalEntries: 0, symptomEpisodes: 0, potentialTriggers: 0, dataCompleteness: 0 });
  
  const correlationService = useMemo(() => new CorrelationService(), []);

  // Mock data - in production this would come from a data store
  const mockEntries = useMemo(() => [
    {
      id: '1',
      userId: 'user1',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      type: 'food' as const,
      data: {
        id: '1',
        userId: 'user1',
        mealLabel: 'Avocado toast',
        ingredients: [
          { id: 'ing1', name: 'Bread', portion: '2 slices' },
          { id: 'ing2', name: 'Avocado', portion: '1/2 avocado' },
          { id: 'ing3', name: 'Eggs', portion: '2 eggs' }
        ],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        mealType: 'breakfast' as const
      } as FoodEntry
    },
    {
      id: '2',
      userId: 'user1',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours after bread
      type: 'symptom' as const,
      data: {
        id: '2',
        userId: 'user1',
        symptomType: 'bloating',
        severity: 7,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
      } as SymptomEntry
    },
    {
      id: '3',
      userId: 'user1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      type: 'food' as const,
      data: {
        id: '3',
        userId: 'user1',
        ingredients: [
          { id: 'ing4', name: 'Bread', portion: '2 slices' },
          { id: 'ing5', name: 'Cheese (Cheddar)', portion: '2 slices' }
        ],
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        mealType: 'lunch' as const
      } as FoodEntry
    },
    {
      id: '4',
      userId: 'user1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours after cheese
      type: 'symptom' as const,
      data: {
        id: '4',
        userId: 'user1',
        symptomType: 'bloating',
        severity: 6,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
      } as SymptomEntry
    },
    {
      id: '5',
      userId: 'user1',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      type: 'food' as const,
      data: {
        id: '5',
        userId: 'user1',
        ingredients: [
          { id: 'ing6', name: 'Bread', portion: '2 slices' },
          { id: 'ing7', name: 'Tomatoes', portion: '2 slices' }
        ],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mealType: 'breakfast' as const
      } as FoodEntry
    },
    {
      id: '6',
      userId: 'user1',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after tomatoes
      type: 'symptom' as const,
      data: {
        id: '6',
        userId: 'user1',
        symptomType: 'bloating',
        severity: 8,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
      } as SymptomEntry
    }
  ], []);

  useEffect(() => {
    const timeframeDays = selectedTimeframe === '7days' ? 7 : selectedTimeframe === '30days' ? 30 : 90;
    const analysis = correlationService.analyzeCorrelations(mockEntries, selectedSymptom, timeframeDays);
    
    const formattedTriggerData: TriggerData[] = analysis.triggers.map(trigger => ({
      item: trigger.item,
      correlation: trigger.correlationPercentage,
      exposure: Math.round((trigger.totalExposures / timeframeDays) * 10), // Rough exposure percentage
      occurrences: `${trigger.occurrences}/${trigger.totalExposures} times`
    }));
    
    setTriggerData(formattedTriggerData);
    setAnalysisData({
      totalEntries: analysis.totalEntries,
      symptomEpisodes: analysis.symptomEpisodes,
      potentialTriggers: analysis.triggers.length,
      dataCompleteness: Math.min(100, Math.round((analysis.totalEntries / timeframeDays) * 10))
    });
  }, [selectedSymptom, selectedTimeframe, correlationService, mockEntries]);

  const trendData: TrendData[] = [
    { date: 'Week 1', symptoms: 4, item: 8 },
    { date: 'Week 2', symptoms: 6, item: 12 },
    { date: 'Week 3', symptoms: 2, item: 6 },
    { date: 'Week 4', symptoms: 5, item: 10 }
  ];

  const symptoms = ['bloating', 'pain', 'gas', 'urgency', 'fatigue'];
  const timeframes = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 3 months' }
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: '#fa7888',
          fontFamily: 'Playfair Display',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Your Health Reports
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Filter Controls */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                alignItems: 'center'
              }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Symptom</InputLabel>
                  <Select
                    value={selectedSymptom}
                    label="Symptom"
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                  >
                    {symptoms.map((symptom) => (
                      <MenuItem key={symptom} value={symptom}>
                        {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Time Period</InputLabel>
                  <Select
                    value={selectedTimeframe}
                    label="Time Period"
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                  >
                    {timeframes.map((timeframe) => (
                      <MenuItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    size="small"
                    sx={{ color: '#fa7888', borderColor: '#fa7888' }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileDownload />}
                    size="small"
                    sx={{ backgroundColor: '#fa7888' }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Food Diary Report */}
        <Box>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}
              >
                Detailed Food Diary Report
              </Typography>

              {(() => {
                const groupedByDay = mockEntries
                  .filter(entry => entry.type === 'food')
                  .reduce((acc, entry) => {
                    const date = entry.timestamp.toDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry);
                    return acc;
                  }, {} as Record<string, DiaryEntry[]>);
                
                return Object.entries(groupedByDay)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 7) // Show last 7 days
                  .map(([date, dayEntries]) => (
                    <Box key={date} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#fa7888' }}>
                        {new Date(date).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      
                      {dayEntries
                        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                        .map((entry, index) => {
                          const foodData = entry.data as FoodEntry;
                          return (
                            <Box key={entry.id} sx={{ mb: 2, pl: 2, borderLeft: '3px solid #f0f0f0' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#c27b70' }}>
                                {foodData.mealType.charAt(0).toUpperCase() + foodData.mealType.slice(1)} – {entry.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                {foodData.mealLabel && `: ${foodData.mealLabel}`}
                              </Typography>
                              
                              <Box sx={{ mt: 1, pl: 2 }}>
                                {foodData.ingredients.map((ingredient, i) => (
                                  <Typography key={ingredient.id} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    • {ingredient.name} ({ingredient.portion})
                                    {ingredient.brandName && ` - ${ingredient.brandName}`}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          );
                        })}
                    </Box>
                  ));
              })()}
              
              {mockEntries.filter(entry => entry.type === 'food').length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No food entries found for the selected period.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Charts Section */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Key Triggers Report */}
          <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}
              >
                Potential Triggers for {selectedSymptom.charAt(0).toUpperCase() + selectedSymptom.slice(1)}
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={triggerData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="item" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exposure" fill="#4caf50" name="Exposure %" />
                  <Bar dataKey="correlation" fill="#ff9800" name="Correlation %" />
                </BarChart>
              </ResponsiveContainer>

              {triggerData.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Top Ingredient Triggers:
                  </Typography>
                  {triggerData.slice(0, 5).map((trigger, index) => (
                    <Box
                      key={trigger.item}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.5,
                        borderTop: index > 0 ? '1px solid #e0e0e0' : 'none',
                        backgroundColor: index < 3 ? '#fafafa' : 'transparent',
                        px: index < 3 ? 1 : 0,
                        borderRadius: index < 3 ? 1 : 0
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                          {trigger.item}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Consumed {trigger.occurrences}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={`${trigger.correlation}% correlation`}
                          size="small"
                          color={trigger.correlation > 60 ? 'error' : trigger.correlation > 30 ? 'warning' : 'default'}
                          variant="outlined"
                        />
                        {index < 3 && (
                          <Chip
                            label="High Risk"
                            size="small"
                            color="error"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                  {triggerData.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No significant correlations found. Try logging more meals and symptoms.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ mt: 2, textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No ingredient triggers found for {selectedSymptom}.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Try logging more meals with individual ingredients and symptoms to see correlations.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          </Box>

        {/* Trends Chart */}
          <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}
              >
                Symptom Trends
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="symptoms"
                    stroke="#f44336"
                    strokeWidth={2}
                    name="Symptom Episodes"
                  />
                  <Line
                    type="monotone"
                    dataKey="item"
                    stroke="#2196f3"
                    strokeWidth={2}
                    name="Item Consumption"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Box>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}
              >
                Summary Statistics
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 3 
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {analysisData.totalEntries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    {analysisData.symptomEpisodes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Symptom Episodes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                    {analysisData.potentialTriggers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingredient Triggers
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    {analysisData.dataCompleteness}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data Completeness
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Data completeness
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analysisData.dataCompleteness}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4caf50'
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};