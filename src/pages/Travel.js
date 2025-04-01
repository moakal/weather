import React, { useState } from "react";
import { Box, Typography, Paper, Button, Stack, useTheme } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Link, useLocation } from "react-router-dom";

export default function Travel() {
  const theme = useTheme();
  const location = useLocation();
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
        <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction component={Link} to="/timetable" label="Timetable" icon={<EventIcon />} />
        <BottomNavigationAction component={Link} to="/travel" label="Travel" icon={<DirectionsCarIcon />} />
        <BottomNavigationAction component={Link} to="/weather" label="Weather" icon={<WbSunnyIcon />} />
      </BottomNavigation>
    </>
  );
}