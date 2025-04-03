import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import {
  Home as HomeIcon,
  Event as EventIcon,
  DirectionsCar as DirectionsCarIcon,
  WbSunny as WbSunnyIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        );
        setWeather(res.data);
      } catch {
        console.error("Failed to fetch weather");
      }
    });
  }, []);

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

  const weatherType = weather?.weather?.[0]?.main || "Default";
  const backgroundImage = {
    Clear: "url('/images/clear-sky.jpg')",
    Clouds: "url('/images/cloudy.jpg')",
    Rain: "url('/images/rainy.jpg')",
    Snow: "url('/images/snowy.jpg')",
    Thunderstorm: "url('/images/thunderstorm.jpg')",
    Default: "url('/images/default.jpg')",
  }[weatherType];

  const WeatherIcon = {
    Clear: <WiDaySunny size={56} />,
    Clouds: <WiCloud size={56} />,
    Rain: <WiRain size={56} />,
    Snow: <WiSnow size={56} />,
    Thunderstorm: <WiThunderstorm size={56} />,
    Default: <WiCloud size={56} />,
  }[weatherType];

  return (
    <>
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
        <Stack spacing={1.5} alignItems="center" sx={{ mt: 4, mb: 3, color: "black" }}>
          <Typography variant="h5" fontWeight="bold">
            {weather?.name || "Mile End"}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {WeatherIcon}
            <Typography variant="h2">
              {weather ? `${Math.round(weather.main.temp)}°` : "9°"}
            </Typography>
          </Stack>
          <Typography textTransform="capitalize">
            {weather?.weather?.[0]?.description || "Heavy Rain"}
          </Typography>
        </Stack>

        <Stack spacing={2} alignItems="center">
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon sx={{ fontSize: 24 }} />
                <Box>
                  <Typography fontWeight="bold" fontSize={15}>Upcoming Activity</Typography>
                  <Typography fontSize={14}>Graphical User Interfaces</Typography>
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

          {[
            { name: "Elizabeth", status: "Good Service", color: "#9c27b0", statusColor: "green" },
            { name: "Central", status: "Severe Delays", color: "#f44336", statusColor: "red" },
          ].map((line) => (
            <Paper
              key={line.name}
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
                  backgroundColor: line.color,
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {line.name}
              </Typography>
              <Typography
                sx={{
                  color: line.statusColor,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {line.status}
              </Typography>
            </Paper>
          ))}

          <Typography
            sx={{
              color: "black",
              mt: 1,
              fontWeight: "bold",
              fontSize: 17,
              textAlign: "center",
              borderRadius: 2,
              px: 1,
              py: 0.5,
            }}
          >
            ⚠️ Expect delays to journey of up to 20 mins ⚠️
          </Typography>
        </Stack>
      </Box>

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
