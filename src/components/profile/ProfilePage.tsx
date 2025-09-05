import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Download,
  Settings,
  Security,
  Help,
  Logout as LogoutIcon,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    reminders: true,
    dataSharing: false
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '',
    height: '',
    weight: '',
    notes: ''
  });

  const handleExportData = (format: 'pdf' | 'csv') => {
    // In production, this would generate and download the actual file
    console.log(`Exporting data as ${format.toUpperCase()}`);
    alert(`Exporting your data as ${format.toUpperCase()}...`);
    setExportDialogOpen(false);
  };

  const handleSaveProfile = () => {
    // In production, this would update the user profile
    console.log('Updating profile:', profileData);
    setEditDialogOpen(false);
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
        Profile & Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Profile Information */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#fa7888',
                    mr: 3,
                    fontSize: '2rem'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ color: '#fa7888', fontFamily: 'Playfair Display' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: user?.role === 'clinician' ? '#4caf50' : '#2196f3',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ color: '#fa7888', borderColor: '#fa7888' }}
                >
                  Edit Profile
                </Button>
              </Box>

              {user?.role === 'patient' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Your access code: <strong>{(user as any).accessCode}</strong>
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Data & Export */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}>
                Data & Export
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Export your health data for personal records or to share with other healthcare providers.
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Download />}
                onClick={() => setExportDialogOpen(true)}
                sx={{ 
                  backgroundColor: '#fa7888',
                  mb: 2,
                  '&:hover': { backgroundColor: '#e66a7a' }
                }}
              >
                Export My Data
              </Button>

              <Typography variant="body2" color="text.secondary">
                Last backup: Never
              </Typography>
            </CardContent>
          </Card>
          </Box>

        {/* Settings */}
          <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}>
                App Settings
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#fa7888' } }}
                  />
                }
                label="Push Notifications"
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.reminders}
                    onChange={(e) => setSettings({ ...settings, reminders: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#fa7888' } }}
                  />
                }
                label="Daily Reminders"
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataSharing}
                    onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#fa7888' } }}
                  />
                }
                label="Anonymous Data Sharing"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              />
            </CardContent>
          </Card>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap: 2 
              }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Security />}
                  sx={{ color: '#c27b70', borderColor: '#c27b70' }}
                >
                  Privacy Settings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Help />}
                  sx={{ color: '#c27b70', borderColor: '#c27b70' }}
                >
                  Help & Support
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Settings />}
                  sx={{ color: '#c27b70', borderColor: '#c27b70' }}
                >
                  App Settings
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{ color: '#f44336', borderColor: '#f44336' }}
                >
                  Sign Out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Statistics */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fa7888', mb: 2, fontFamily: 'Playfair Display' }}>
                Your Statistics
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 3 
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    42
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    8
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Symptom Days
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    14
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days Tracked
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
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#fa7888', fontFamily: 'Playfair Display' }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            margin="normal"
          />
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            mt: 1
          }}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={profileData.age}
              onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              value={profileData.height}
              onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={profileData.weight}
              onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
              margin="normal"
            />
          </Box>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={profileData.notes}
            onChange={(e) => setProfileData({ ...profileData, notes: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#c27b70' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            sx={{ backgroundColor: '#fa7888' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#fa7888', fontFamily: 'Playfair Display' }}>
          Export Your Data
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose the format for your data export. This will include all your entries, symptoms, and reports.
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2 
          }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleExportData('pdf')}
              sx={{ 
                py: 2,
                color: '#fa7888',
                borderColor: '#fa7888',
                '&:hover': {
                  backgroundColor: 'rgba(250, 120, 136, 0.1)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">PDF Report</Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive report with charts
                </Typography>
              </Box>
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleExportData('csv')}
              sx={{ 
                py: 2,
                color: '#fa7888',
                borderColor: '#fa7888',
                '&:hover': {
                  backgroundColor: 'rgba(250, 120, 136, 0.1)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">CSV Data</Typography>
                <Typography variant="body2" color="text.secondary">
                  Raw data for analysis
                </Typography>
              </Box>
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)} sx={{ color: '#c27b70' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};