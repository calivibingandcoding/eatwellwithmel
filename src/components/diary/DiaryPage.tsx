import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Restaurant,
  LocalDrink,
  MedicationOutlined,
  FitnessCenter,
  Mood,
  Warning,
  Edit,
  Delete
} from '@mui/icons-material';
import { format } from 'date-fns';

interface DiaryEntryItem {
  id: string;
  type: 'food' | 'drink' | 'supplement' | 'exercise' | 'wellness' | 'symptom' | 'bowel_movement';
  timestamp: Date;
  title: string;
  details: string;
  severity?: number;
}

export const DiaryPage: React.FC = () => {
  const [entries] = useState<DiaryEntryItem[]>([
    {
      id: '1',
      type: 'food',
      timestamp: new Date(),
      title: 'Breakfast',
      details: 'Oatmeal with berries, Almond milk'
    },
    {
      id: '2',
      type: 'symptom',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      title: 'Bloating',
      details: 'Moderate bloating after meal',
      severity: 6
    },
    {
      id: '3',
      type: 'drink',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      title: 'Coffee',
      details: 'Large coffee with oat milk'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <Restaurant sx={{ color: '#4caf50' }} />;
      case 'drink':
        return <LocalDrink sx={{ color: '#2196f3' }} />;
      case 'supplement':
        return <MedicationOutlined sx={{ color: '#9c27b0' }} />;
      case 'exercise':
        return <FitnessCenter sx={{ color: '#ff9800' }} />;
      case 'wellness':
        return <Mood sx={{ color: '#ffeb3b' }} />;
      case 'symptom':
      case 'bowel_movement':
        return <Warning sx={{ color: '#f44336' }} />;
      default:
        return <Restaurant />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food':
        return '#4caf50';
      case 'drink':
        return '#2196f3';
      case 'supplement':
        return '#9c27b0';
      case 'exercise':
        return '#ff9800';
      case 'wellness':
        return '#ffeb3b';
      case 'symptom':
      case 'bowel_movement':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const dateKey = format(entry.timestamp, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, DiaryEntryItem[]>);

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
        Your Daily Diary
      </Typography>

      {Object.entries(groupedEntries)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, dayEntries]) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#c27b70',
                fontFamily: 'Avenir Light',
                mb: 2,
                textAlign: 'center'
              }}
            >
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </Typography>

            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 1 }}>
                <List>
                  {dayEntries
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((entry) => (
                      <ListItem key={entry.id} sx={{ py: 1 }}>
                        <Box sx={{ mr: 2 }}>
                          {getIcon(entry.type)}
                        </Box>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">
                                {entry.title}
                              </Typography>
                              <Chip
                                label={entry.type.replace('_', ' ')}
                                size="small"
                                sx={{
                                  backgroundColor: getTypeColor(entry.type),
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                              {entry.severity && (
                                <Chip
                                  label={`${entry.severity}/10`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {entry.details}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(entry.timestamp, 'h:mm a')}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" sx={{ color: '#c27b70' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#f44336' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        ))}

      {entries.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography
            variant="h6"
            sx={{ color: '#c27b70', mb: 2 }}
          >
            No entries yet
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#c27b70', mb: 4 }}
          >
            Start tracking your meals, symptoms, and wellness factors
          </Typography>
        </Box>
      )}
    </Box>
  );
};