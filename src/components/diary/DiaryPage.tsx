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
  ListItemSecondaryAction,
  Collapse
} from '@mui/material';
import {
  Restaurant,
  LocalDrink,
  MedicationOutlined,
  FitnessCenter,
  Mood,
  Warning,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { format } from 'date-fns';
import { FoodEntry } from '../../types';

interface DiaryEntryItem {
  id: string;
  type: 'food' | 'drink' | 'supplement' | 'exercise' | 'wellness' | 'symptom' | 'bowel_movement';
  timestamp: Date;
  title: string;
  details: string;
  severity?: number;
  foodEntry?: FoodEntry; // For food entries with ingredients
}

export const DiaryPage: React.FC = () => {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  
  const [entries] = useState<DiaryEntryItem[]>([
    {
      id: '1',
      type: 'food',
      timestamp: new Date(),
      title: 'Breakfast',
      details: 'Avocado toast',
      foodEntry: {
        id: '1',
        userId: 'user1',
        mealLabel: 'Avocado toast',
        ingredients: [
          { id: 'ing1', name: 'Bread', portion: '2 slices', brandName: 'Hovis' },
          { id: 'ing2', name: 'Avocado', portion: '1/2 avocado' },
          { id: 'ing3', name: 'Eggs', portion: '2 eggs' },
          { id: 'ing4', name: 'Pumpkin seeds', portion: '1 tbsp' }
        ],
        timestamp: new Date(),
        mealType: 'breakfast' as const
      }
    },
    {
      id: '1b',
      type: 'food',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      title: 'Breakfast',
      details: 'Porridge with berries, Almond milk',
      foodEntry: {
        id: '1b',
        userId: 'user1',
        ingredients: [
          { id: 'ing5', name: 'Porridge', portion: '1 bowl' },
          { id: 'ing6', name: 'Berries (Mixed)', portion: '1/2 cup' },
          { id: 'ing7', name: 'Almond Milk', portion: '1/4 cup' }
        ],
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        mealType: 'breakfast' as const
      }
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

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const renderFoodDetails = (entry: DiaryEntryItem) => {
    if (entry.type !== 'food' || !entry.foodEntry) {
      return entry.details;
    }
    
    const { foodEntry } = entry;
    const hasMultipleIngredients = foodEntry.ingredients.length > 1;
    const isExpanded = expandedEntries.has(entry.id);
    
    if (foodEntry.mealLabel) {
      return (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {foodEntry.mealLabel}
            </Typography>
            {hasMultipleIngredients && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(entry.id);
                }}
                sx={{ color: '#c27b70' }}
              >
                {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #f0f0f0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                Ingredients:
              </Typography>
              {foodEntry.ingredients.map((ingredient, index) => (
                <Box key={ingredient.id} sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    • {ingredient.name} ({ingredient.portion})
                    {ingredient.brandName && ` - ${ingredient.brandName}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      );
    } else {
      // No custom meal label, show ingredients directly
      if (hasMultipleIngredients && !isExpanded) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {foodEntry.ingredients.length} ingredients
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(entry.id);
              }}
              sx={{ color: '#c27b70' }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          </Box>
        );
      } else if (hasMultipleIngredients && isExpanded) {
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {foodEntry.ingredients.length} ingredients
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(entry.id);
                }}
                sx={{ color: '#c27b70' }}
              >
                <ExpandLess fontSize="small" />
              </IconButton>
            </Box>
            <Collapse in={isExpanded}>
              <Box sx={{ mt: 1, pl: 2, borderLeft: '2px solid #f0f0f0' }}>
                {foodEntry.ingredients.map((ingredient, index) => (
                  <Box key={ingredient.id} sx={{ mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      • {ingredient.name} ({ingredient.portion})
                      {ingredient.brandName && ` - ${ingredient.brandName}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        );
      } else {
        // Single ingredient, show directly
        const ingredient = foodEntry.ingredients[0];
        return (
          <Typography variant="body2" color="text.secondary">
            {ingredient.name} ({ingredient.portion})
            {ingredient.brandName && ` - ${ingredient.brandName}`}
          </Typography>
        );
      }
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
                              {entry.type === 'food' && entry.foodEntry ? 
                                renderFoodDetails(entry) : 
                                <Typography variant="body2" color="text.secondary">
                                  {entry.details}
                                </Typography>
                              }
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