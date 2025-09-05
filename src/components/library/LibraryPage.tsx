import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Star,
  StarBorder,
  Search,
  Add,
  Edit,
  Delete,
  Restaurant,
  LocalDrink,
  MedicationOutlined,
  FitnessCenter
} from '@mui/icons-material';

interface LibraryItem {
  id: string;
  name: string;
  type: 'food' | 'drink' | 'supplement' | 'exercise';
  isFavorite: boolean;
  usageCount: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const LibraryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: 'food' as const });

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    { id: '1', name: 'Oatmeal', type: 'food', isFavorite: true, usageCount: 15 },
    { id: '2', name: 'Almond Milk', type: 'drink', isFavorite: true, usageCount: 12 },
    { id: '3', name: 'Probiotics', type: 'supplement', isFavorite: false, usageCount: 8 },
    { id: '4', name: 'Morning Yoga', type: 'exercise', isFavorite: true, usageCount: 20 },
    { id: '5', name: 'Brown Rice', type: 'food', isFavorite: false, usageCount: 6 },
    { id: '6', name: 'Green Tea', type: 'drink', isFavorite: false, usageCount: 10 }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (id: string) => {
    setLibraryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      const item: LibraryItem = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        type: newItem.type,
        isFavorite: false,
        usageCount: 0
      };
      setLibraryItems(prev => [...prev, item]);
      setNewItem({ name: '', type: 'food' });
      setDialogOpen(false);
    }
  };

  const getFilteredItems = (type?: string) => {
    let filtered = libraryItems;
    
    if (type && type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.usageCount - a.usageCount;
    });
  };

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
      default:
        return '#757575';
    }
  };

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Foods', value: 'food' },
    { label: 'Drinks', value: 'drink' },
    { label: 'Supplements', value: 'supplement' },
    { label: 'Exercise', value: 'exercise' },
    { label: 'Favorites', value: 'favorites' }
  ];

  const getCurrentItems = () => {
    const currentTab = tabs[tabValue];
    if (currentTab.value === 'favorites') {
      return getFilteredItems().filter(item => item.isFavorite);
    }
    return getFilteredItems(currentTab.value === 'all' ? undefined : currentTab.value);
  };

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
        My Library
      </Typography>

      <TextField
        fullWidth
        placeholder="Search your library..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#c27b70' }} />
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: '#c27b70',
              '&.Mui-selected': {
                color: '#fa7888'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#fa7888'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Card>
        <CardContent sx={{ p: 1 }}>
          <List>
            {getCurrentItems().map((item) => (
              <ListItem key={item.id} sx={{ py: 1.5 }}>
                <Box sx={{ mr: 2 }}>
                  {getIcon(item.type)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.type}
                        size="small"
                        sx={{
                          backgroundColor: getTypeColor(item.type),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                      {item.isFavorite && (
                        <Star sx={{ color: '#ffeb3b', fontSize: 16 }} />
                      )}
                    </Box>
                  }
                  secondary={`Used ${item.usageCount} times`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(item.id)}
                    sx={{ color: item.isFavorite ? '#ffeb3b' : '#c27b70' }}
                  >
                    {item.isFavorite ? <Star /> : <StarBorder />}
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#c27b70' }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#f44336' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            
            {getCurrentItems().length === 0 && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{ textAlign: 'center', color: '#c27b70', py: 4 }}
                    >
                      {searchTerm ? 'No items found' : 'No items in your library yet'}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 16,
          backgroundColor: '#fa7888',
          '&:hover': {
            backgroundColor: '#e66a7a'
          }
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Add />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#fa7888', fontFamily: 'Playfair Display' }}>
          Add Custom Item
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={newItem.type}
              label="Type"
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
            >
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="drink">Drink</MenuItem>
              <MenuItem value="supplement">Supplement</MenuItem>
              <MenuItem value="exercise">Exercise</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#c27b70' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            sx={{ backgroundColor: '#fa7888' }}
            disabled={!newItem.name.trim()}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};