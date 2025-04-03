// Import React and tools for managing state and side effects
import React, { useEffect, useState } from "react";
import axios from "axios";

// Import layout and UI components from Material UI
import {
  Box,
  Typography,
  Paper,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

// Import weather icons from react-icons
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

// Import app icons from Material UI
import {
  Home as HomeIcon,
  Event as EventIcon,
  DirectionsCar as DirectionsCarIcon,
  WbSunny as WbSunnyIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

// For page navigation
import { Link } from "react-router-dom";

const Home = () => {
  // State for storing weather data
  const [weather, setWeather] = useState(null);

  // State for storing tube line statuses
  const [lineStatuses, setLineStatuses] = useState([]);

  // This function runs once when the page loads
  useEffect(() => {
    // Get current weather based on user's location
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );
        setWeather(res.data); // Store weather data in state
      } catch {
        console.error("Failed to fetch weather");
      }
    });

    // Get live tube statuses for Elizabeth, Central, and Victoria lines
    const fetchLineStatuses = async () => {
      try {
        const res = await axios.get(
          "https://api.tfl.gov.uk/Line/elizabeth,central,victoria/Status"
        );
        setLineStatuses(res.data); // Store line data in state
      } catch {
        console.error("Failed to fetch line statuses");
      }
    };

    fetchLineStatuses();
  }, []);

  // Style object used for cards on the page
  const cardStyle = {
    width: "100%",
    maxWidth: 450,
    p: 2,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(12px)",
    border: "1.5px solid rgba(255,255,255,0.4)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  };

  // Select background image based on weather condition
  const weatherType = weather?.weather?.[0]?.main || "Default";
  const backgroundImage = {
    Clear: "url('/images/clear-sky.jpg')",
    Clouds: "url('/images/cloudy.jpg')",
    Rain: "url('/images/rainy.jpg')",
    Snow: "url('/images/snowy.jpg')",
    Thunderstorm: "url('/images/thunderstorm.jpg')",
    Default: "url('/images/default.jpg')",
  }[weatherType];

  // Select weather icon to show
  const WeatherIcon = {
    Clear: <WiDaySunny size={56} />,
    Clouds: <WiCloud size={56} />,
    Rain: <WiRain size={56} />,
    Snow: <WiSnow size={56} />,
    Thunderstorm: <WiThunderstorm size={56} />,
    Default: <WiCloud size={56} />,
  }[weatherType];

  // Assign line color based on line ID
  const getLineColor = (id) => {
    return {
      central: "#E32017",
      elizabeth: "#6950a1",
      victoria: "#0098D4",
    }[id] || "#ccc";
  };

  // Assign text color based on service status
  const getStatusColor = (status) => {
    if (status === "Good Service") return "green";
    if (status === "Severe Delays") return "red";
    return "#e65100"; // Used for minor or other delays
  };

  return (
    <>
      {/* Main page background with dynamic image */}
      <Box
        sx={{
          p: 2,
          pb: 10,
          minHeight: "100vh",
          backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        {/* Section that shows weather and location */}
        <Stack spacing={1.5} alignItems="center" sx={{ mt: 4, mb: 3, color: "black" }}>
          <Typography variant="h5" fontWeight="bold">
            {weather?.name || "Mile End"} {/* City name */}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {WeatherIcon} {/* Weather icon */}
            <Typography variant="h2">
              {weather ? `${Math.round(weather.main.temp)}°` : "9°"} {/* Temperature */}
            </Typography>
          </Stack>
          <Typography textTransform="capitalize">
            {weather?.weather?.[0]?.description || "Heavy Rain"} {/* Description */}
          </Typography>
        </Stack>

        {/* Main content area with cards */}
        <Stack spacing={2} alignItems="center">
          {/* Card showing upcoming uni event */}
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon sx={{ fontSize: 24 }} />
                <Box>
                  <Typography fontWeight="bold" fontSize={15}>Upcoming Activity</Typography>
                  <Typography fontSize={14}>Chemistry</Typography>
                </Box>
              </Stack>
              <Typography fontSize={14} color="text.secondary">12:00 PM</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <AccessTimeIcon fontSize="small" />
              <Typography fontSize={18} fontWeight="bold" color="black">
                Leave by 11:00
              </Typography>
              <AccessTimeIcon fontSize="small" />
            </Stack>
          </Paper>

          {/* Title above line status cards */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%", maxWidth: 470, px: 2, color: "black", mt: 6 }}
          >
            <Typography fontWeight="medium" fontSize={16}>Transport Updates</Typography>
            <Typography
              component={Link}
              to="/travel"
              fontWeight="medium"
              fontSize={16}
              sx={{ opacity: 0.8, textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              See More
            </Typography>
          </Stack>

          {/* For each line, show a card with its name and status */}
          {lineStatuses.map((line) => {
            const status = line.lineStatuses[0]?.statusSeverityDescription || "Unknown";
            return (
              <Paper
                key={line.id}
                sx={{
                  ...cardStyle,
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: getLineColor(line.id),
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {line.name.replace(/ line$/i, "")} {/* Cleaned name */}
                </Typography>

                <Typography
                  sx={{
                    color: getStatusColor(status),
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {status}
                </Typography>
              </Paper>
            );
          })}

          {/* Show warning if any lines are delayed */}
          {(() => {
            const delays = lineStatuses.map(
              (line) => line.lineStatuses[0]?.statusSeverityDescription
            );

            if (delays.includes("Severe Delays")) {
              return (
                <Typography sx={{ color: "black", mt: 1, fontWeight: "bold", fontSize: 17 }}>
                  ⚠️ Expect delays of up to 20 mins ⚠️
                </Typography>
              );
            } else if (delays.includes("Minor Delays")) {
              return (
                <Typography sx={{ color: "black", mt: 1, fontWeight: "bold", fontSize: 17 }}>
                  ⚠️ Expect delays of up to 10 mins ⚠️
                </Typography>
              );
            }

            return null; // no delays, so nothing is shown
          })()}
        </Stack>
      </Box>

      {/* Bottom tab bar for navigation */}
      <BottomNavigation sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} showLabels>
        <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction component={Link} to="/timetable" label="Timetable" icon={<EventIcon />} />
        <BottomNavigationAction component={Link} to="/travel" label="Travel" icon={<DirectionsCarIcon />} />
        <BottomNavigationAction component={Link} to="/weather" label="Weather" icon={<WbSunnyIcon />} />
      </BottomNavigation>
    </>
  );
};

export default Home;
