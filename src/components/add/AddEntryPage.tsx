import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Autocomplete,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Restaurant,
  LocalDrink,
  MedicationOutlined,
  FitnessCenter,
  Mood,
  Warning,
  ColorizeOutlined
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BristolStoolChart } from '../../types';
import { searchFoods, searchDrinks, searchSupplements, searchExercises } from '../../data/foodDatabase';

type EntryType = 'food' | 'drink' | 'supplement' | 'exercise' | 'wellness' | 'symptom' | 'bowel_movement';

export const AddEntryPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const entryTypes = [
    { type: 'food', label: 'Food', icon: Restaurant, color: '#4caf50' },
    { type: 'drink', label: 'Drink', icon: LocalDrink, color: '#2196f3' },
    { type: 'supplement', label: 'Supplement', icon: MedicationOutlined, color: '#9c27b0' },
    { type: 'exercise', label: 'Exercise', icon: FitnessCenter, color: '#ff9800' },
    { type: 'wellness', label: 'Wellness', icon: Mood, color: '#ffeb3b' },
    { type: 'symptom', label: 'Symptom', icon: Warning, color: '#f44336' },
    { type: 'bowel_movement', label: 'Bowel Movement', icon: ColorizeOutlined, color: '#795548' }
  ];

  const handleTypeSelect = (type: EntryType) => {
    setSelectedType(type);
    setFormData({ timestamp: new Date() });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedType(null);
    setFormData({});
  };

  const handleSave = () => {
    console.log('Saving entry:', { type: selectedType, ...formData });
    // In production, this would save to the database
    handleClose();
  };

  const renderFormFields = () => {
    switch (selectedType) {
      case 'food':
        return (
          <>
            <Autocomplete
              freeSolo
              options={searchFoods(formData.searchQuery || '', 10)}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              value={formData.selectedFood || null}
              onChange={(_, value) => {
                const foodItem = typeof value === 'string' ? value : value?.name || '';
                const commonSizes = typeof value === 'object' && value?.commonSizes ? value.commonSizes : [];
                setFormData({ 
                  ...formData, 
                  foodItem,
                  selectedFood: value,
                  commonSizes
                });
              }}
              onInputChange={(_, value) => {
                setFormData({ ...formData, searchQuery: value, foodItem: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Search Food Item"
                  margin="normal"
                  required
                  placeholder="Start typing to search..."
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  <ListItemText
                    primary={option.name}
                    secondary={option.category}
                  />
                </ListItem>
              )}
            />
            {formData.commonSizes && formData.commonSizes.length > 0 && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Common portions:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.commonSizes.map((size: string) => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => setFormData({ ...formData, portion: size })}
                      variant="outlined"
                      size="small"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <TextField
              fullWidth
              label="Portion/Amount"
              value={formData.portion || ''}
              onChange={(e) => setFormData({ ...formData, portion: e.target.value })}
              margin="normal"
              required
              placeholder="e.g., 1 cup, 2 slices, 100g"
            />
            <TextField
              fullWidth
              label="Brand Name (optional)"
              value={formData.brandName || ''}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={formData.mealType || ''}
                label="Meal Type"
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'drink':
        return (
          <>
            <Autocomplete
              freeSolo
              options={searchDrinks(formData.searchQuery || '', 10)}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              value={formData.selectedDrink || null}
              onChange={(_, value) => {
                const drinkItem = typeof value === 'string' ? value : value?.name || '';
                const commonSizes = typeof value === 'object' && value?.commonSizes ? value.commonSizes : [];
                setFormData({ 
                  ...formData, 
                  drinkItem,
                  selectedDrink: value,
                  commonSizes
                });
              }}
              onInputChange={(_, value) => {
                setFormData({ ...formData, searchQuery: value, drinkItem: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Search Drink Item"
                  margin="normal"
                  required
                  placeholder="Start typing to search..."
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  <ListItemText
                    primary={option.name}
                    secondary={option.category}
                  />
                </ListItem>
              )}
            />
            {formData.commonSizes && formData.commonSizes.length > 0 && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Common amounts:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.commonSizes.map((size: string) => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => setFormData({ ...formData, amount: size })}
                      variant="outlined"
                      size="small"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <TextField
              fullWidth
              label="Amount"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              margin="normal"
              required
              placeholder="e.g., 1 cup, 500ml, 16 oz"
            />
            <TextField
              fullWidth
              label="Brand Name (optional)"
              value={formData.brandName || ''}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              margin="normal"
            />
          </>
        );

      case 'supplement':
        return (
          <>
            <Autocomplete
              freeSolo
              options={searchSupplements(formData.searchQuery || '', 10)}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              value={formData.selectedSupplement || null}
              onChange={(_, value) => {
                const supplementName = typeof value === 'string' ? value : value?.name || '';
                const commonDoses = typeof value === 'object' && value?.commonDoses ? value.commonDoses : [];
                setFormData({ 
                  ...formData, 
                  supplementName,
                  selectedSupplement: value,
                  commonDoses
                });
              }}
              onInputChange={(_, value) => {
                setFormData({ ...formData, searchQuery: value, supplementName: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Search Supplement"
                  margin="normal"
                  required
                  placeholder="Start typing to search..."
                />
              )}
            />
            {formData.commonDoses && formData.commonDoses.length > 0 && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Common doses:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.commonDoses.map((dose: string) => (
                    <Chip
                      key={dose}
                      label={dose}
                      onClick={() => setFormData({ ...formData, dose })}
                      variant="outlined"
                      size="small"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <TextField
              fullWidth
              label="Dose"
              value={formData.dose || ''}
              onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              margin="normal"
              required
              placeholder="e.g., 1 tablet, 500mg, 2 capsules"
            />
          </>
        );

      case 'exercise':
        return (
          <>
            <Autocomplete
              freeSolo
              options={searchExercises(formData.searchQuery || '', 10)}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              value={formData.selectedExercise || null}
              onChange={(_, value) => {
                const activityType = typeof value === 'string' ? value : value?.name || '';
                setFormData({ 
                  ...formData, 
                  activityType,
                  selectedExercise: value
                });
              }}
              onInputChange={(_, value) => {
                setFormData({ ...formData, searchQuery: value, activityType: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Search Exercise Activity"
                  margin="normal"
                  required
                  placeholder="Start typing to search..."
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  <ListItemText
                    primary={option.name}
                    secondary={option.category}
                  />
                </ListItem>
              )}
            />
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              margin="normal"
              required
            />
          </>
        );

      case 'wellness':
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Wellness Type</InputLabel>
              <Select
                value={formData.type || ''}
                label="Wellness Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="sleep">Sleep Quality</MenuItem>
                <MenuItem value="stress">Stress Level</MenuItem>
                <MenuItem value="energy">Energy Level</MenuItem>
                <MenuItem value="mood">Mood</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Rating (1-10): {formData.rating || 5}
              </Typography>
              <Slider
                value={formData.rating || 5}
                onChange={(_, value) => setFormData({ ...formData, rating: value })}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{ color: '#fa7888' }}
              />
            </Box>
            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
            />
          </>
        );

      case 'symptom':
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Symptom Type</InputLabel>
              <Select
                value={formData.symptomType || ''}
                label="Symptom Type"
                onChange={(e) => setFormData({ ...formData, symptomType: e.target.value })}
              >
                <MenuItem value="pain">Pain</MenuItem>
                <MenuItem value="bloating">Bloating</MenuItem>
                <MenuItem value="gas">Gas</MenuItem>
                <MenuItem value="urgency">Urgency</MenuItem>
                <MenuItem value="fatigue">Fatigue</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            {formData.symptomType === 'other' && (
              <TextField
                fullWidth
                label="Custom Symptom"
                value={formData.customSymptom || ''}
                onChange={(e) => setFormData({ ...formData, customSymptom: e.target.value })}
                margin="normal"
                required
              />
            )}
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>
                Severity (1-10): {formData.severity || 5}
              </Typography>
              <Slider
                value={formData.severity || 5}
                onChange={(_, value) => setFormData({ ...formData, severity: value })}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{ color: '#f44336' }}
              />
            </Box>
            <TextField
              fullWidth
              label="Duration (minutes, optional)"
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              margin="normal"
            />
          </>
        );

      case 'bowel_movement':
        return (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Bristol Stool Type</InputLabel>
              <Select
                value={formData.bristolType || ''}
                label="Bristol Stool Type"
                onChange={(e) => setFormData({ ...formData, bristolType: e.target.value })}
              >
                {Object.entries(BristolStoolChart).map(([type, description]) => (
                  <MenuItem key={type} value={parseInt(type)}>
                    Type {type}: {description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          Add New Entry
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2 
        }}>
          {entryTypes.map(({ type, label, icon: Icon, color }) => (
            <Card
              key={type}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleTypeSelect(type as EntryType)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Icon sx={{ fontSize: 40, color, mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: '#c27b70',
                    fontFamily: 'Avenir Light',
                    fontSize: '1rem'
                  }}
                >
                  {label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: '#fa7888', fontFamily: 'Playfair Display' }}>
            Add {selectedType?.replace('_', ' ').split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')} Entry
          </DialogTitle>
          <DialogContent>
            <DateTimePicker
              label="Date & Time"
              value={formData.timestamp || new Date()}
              onChange={(date) => setFormData({ ...formData, timestamp: date })}
              sx={{ mt: 2, width: '100%' }}
            />
            {renderFormFields()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: '#c27b70' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
              sx={{ backgroundColor: '#fa7888' }}
            >
              Save Entry
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};