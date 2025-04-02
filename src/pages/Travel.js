import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stack, 
  useTheme,
  styled 
} from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Link, useLocation } from "react-router-dom";

// Styled components for consistent layout with Weather component
const TravelContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  paddingBottom: "80px", // Space for bottom navigation
}));

const TravelCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: "blur(2px)",
  width: "100%",
  maxWidth: "450px", // Same as weather component
  margin: 0,
  boxShadow: theme.shadows[0],
}));

/**
 * Travel Component
 * Displays travel information and options
 * Matches the size and style of the Weather component for consistency
 */
export default function Travel() {
  const theme = useTheme();
  const location = useLocation();

  // Sample travel options data
  const travelOptions = [
    { 
      name: "Public Transport", 
      description: "Find bus and train schedules",
      icon: "🚌"
    },
    { 
      name: "Taxi Services", 
      description: "Book a ride nearby",
      icon: "🚖"
    },
    { 
      name: "Bike Sharing", 
      description: "Locate available bikes",
      icon: "🚲"
    },
    { 
      name: "Walking Routes", 
      description: "Get pedestrian directions",
      icon: "🚶"
    },
  ];

  // Set active navigation tab based on current route
  const [navValue, setNavValue] = useState(() => {
    switch(location.pathname) {
      case '/': return 0;
      case '/timetable': return 1;
      case '/travel': return 2;
      case '/weather': return 3;
      default: return 0;
    }
  });

  return (
    <>
 

      {/* Bottom Navigation - Consistent with other pages */}
      <BottomNavigation
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.palette.mode === 'dark' ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: theme.shadows[3],
        }}
        value={navValue}
        onChange={(_, newValue) => setNavValue(newValue)}
        showLabels
      >
        <BottomNavigationAction 
          component={Link}
          to="/"
          label="Home" 
          icon={<HomeIcon />} 
        />
        <BottomNavigationAction 
          component={Link}
          to="/timetable"
          label="Timetable" 
          icon={<EventIcon />} 
        />
        <BottomNavigationAction 
          component={Link}
          to="/travel"
          label="Travel" 
          icon={<DirectionsCarIcon />} 
        />
        <BottomNavigationAction 
          component={Link}
          to="/weather"
          label="Weather" 
          icon={<WbSunnyIcon />} 
        />
      </BottomNavigation>
    </>
  );
}