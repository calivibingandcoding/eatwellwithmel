import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  BookOutlined,
  Assessment,
  Add,
  LibraryBooks,
  Person
} from '@mui/icons-material';

interface BottomNavigationBarProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  value,
  onChange
}) => {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={onChange}
        sx={{
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            color: '#c27b70',
            '&.Mui-selected': {
              color: '#fa7888'
            }
          }
        }}
      >
        <BottomNavigationAction
          label="Diary"
          icon={<BookOutlined />}
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          label="Reports"
          icon={<Assessment />}
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          label="Add"
          icon={
            <Box
              sx={{
                backgroundColor: '#fa7888',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Add />
            </Box>
          }
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          label="My Library"
          icon={<LibraryBooks />}
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
          sx={{ minWidth: 0 }}
        />
      </BottomNavigation>
    </Paper>
  );
};