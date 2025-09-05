import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { BottomNavigationBar } from './BottomNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { DiaryPage } from '../diary/DiaryPage';
import { ReportsPage } from '../reports/ReportsPage';
import { AddEntryPage } from '../add/AddEntryPage';
import { LibraryPage } from '../library/LibraryPage';
import { ProfilePage } from '../profile/ProfilePage';

export const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { user, logout } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 0:
        return <DiaryPage />;
      case 1:
        return <ReportsPage />;
      case 2:
        return <AddEntryPage />;
      case 3:
        return <LibraryPage />;
      case 4:
        return <ProfilePage />;
      default:
        return <DiaryPage />;
    }
  };

  const getPageTitle = () => {
    const titles = ['Diary', 'Reports', 'Add Entry', 'My Library', 'Profile'];
    return titles[currentTab] || 'Diary';
  };

  return (
    <Box sx={{ 
      backgroundColor: '#fdf6f5',
      minHeight: '100vh',
      pb: 9 // Space for bottom navigation
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              color: '#fa7888',
              fontFamily: 'Playfair Display',
              fontWeight: 'bold'
            }}
          >
            {getPageTitle()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              color: '#c27b70',
              mr: 2,
              fontFamily: 'Avenir Light'
            }}
          >
            {user?.name} ({user?.role})
          </Typography>
          <IconButton
            color="inherit"
            onClick={logout}
            sx={{ color: '#c27b70' }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {renderCurrentPage()}
      </Box>

      <BottomNavigationBar
        value={currentTab}
        onChange={handleTabChange}
      />
    </Box>
  );
};