import React, { useState } from 'react';
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

  const triggerData: TriggerData[] = [
    { item: 'Wheat Bread', correlation: 75, exposure: 45, occurrences: '6/8 days' },
    { item: 'Dairy Milk', correlation: 60, exposure: 35, occurrences: '3/5 days' },
    { item: 'Coffee', correlation: 40, exposure: 80, occurrences: '8/20 days' },
    { item: 'Beans', correlation: 80, exposure: 20, occurrences: '4/5 days' },
    { item: 'Tomatoes', correlation: 30, exposure: 25, occurrences: '3/10 days' }
  ];

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
                  <Bar dataKey="correlation" fill="#ff9800" name="Correlation %" />
                  <Bar dataKey="exposure" fill="#4caf50" name="Exposure %" />
                </BarChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2 }}>
                {triggerData.slice(0, 3).map((trigger, index) => (
                  <Box
                    key={trigger.item}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderTop: index > 0 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <Typography variant="body2">
                      {trigger.item}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={trigger.occurrences}
                        size="small"
                        color={trigger.correlation > 60 ? 'error' : 'warning'}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {trigger.correlation}% correlation
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
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
                    18
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Symptom Episodes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Potential Triggers
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    85%
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
                  value={85}
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