import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
  styled,
  useTheme,
} from "@mui/material";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Link, useLocation } from "react-router-dom";

/**
 * Constants for weather backgrounds and icons
 * These define the visual elements for different weather conditions
 */
const WEATHER_BACKGROUNDS = {
  Clear: "url('/images/clear-sky.jpg')",
  Clouds: "url('/images/cloudy.jpg')",
  Rain: "url('/images/rainy.jpg')",
  Snow: "url('/images/snowy.jpg')",
  Thunderstorm: "url('/images/thunderstorm.jpg')",
  Default: "url('/images/default.jpg')",
};

const WEATHER_ICONS = {
  Clear: <WiDaySunny size="1.5em" />,
  Clouds: <WiCloud size="1.5em" />,
  Rain: <WiRain size="1.5em" />,
  Snow: <WiSnow size="1.5em" />,
  Thunderstorm: <WiThunderstorm size="1.5em" />,
  Default: <WiCloud size="1.5em" />,
};

/**
 * Styled Components
 * Reusable styled components for consistent styling throughout the app
 */
const WeatherContainer = styled(Box)(({ background }) => ({
  minHeight: "100vh",
  background,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "background 0.5s ease",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  paddingBottom: "80px", // Extra space for bottom navigation
}));

const WeatherCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 3,
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
  backdropFilter: "blur(2px)",
  width: "100%",
  maxWidth: "95vw",
  margin: 0,
  boxShadow: theme.shadows[0],
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    maxWidth: "450px",
  },
}));

const HourlyScroll = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  margin: theme.spacing(0, -1),
  padding: theme.spacing(0, 1),
}));

const WeeklyScroll = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(1.5),
  width: "100%",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  paddingBottom: theme.spacing(1),
}));

/**
 * Main Weather Component
 * Displays current weather, hourly forecast, and 5-day forecast
 */
export default function Weather() {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const location = useLocation();

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

  /**
   * Fetches weather data from OpenWeatherMap API
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   */
  const fetchData = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      // Fetch both current weather and forecast data in parallel
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`),
      ]);

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  }, []);

  // Get user location and fetch weather data on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchData(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, [fetchData]);

  /**
   * Helper function to format timestamp to time string (e.g., "14:30")
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted time
   */
  const formatTime = (timestamp) => 
    new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  /**
   * Helper function to format timestamp to weekday string (e.g., "Mon")
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted day
   */
  const formatDay = (timestamp) => 
    new Date(timestamp * 1000).toLocaleDateString([], { weekday: "short" });

  // Loading state
  if (loading) {
    return (
      <WeatherContainer background={WEATHER_BACKGROUNDS.Default}>
        <CircularProgress size={60} />
      </WeatherContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <WeatherContainer background={WEATHER_BACKGROUNDS.Default}>
        <WeatherCard>
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        </WeatherCard>
      </WeatherContainer>
    );
  }

  // Destructure weather data for easier access
  const { name, main, weather, wind } = weatherData;
  const weatherType = weather[0].main;
  const background = WEATHER_BACKGROUNDS[weatherType] || WEATHER_BACKGROUNDS.Default;
  const WeatherIcon = WEATHER_ICONS[weatherType] || WEATHER_ICONS.Default;

  return (
    <>
      <WeatherContainer background={background}>
        <WeatherCard>
          <Stack spacing={3}>
            {/* Current Weather Section */}
            <Stack spacing={1.5} alignItems="center">
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
                  {WeatherIcon}
                </Box>
                <Typography variant="h2" component="div" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
                  {Math.round(main.temp)}°
                </Typography>
              </Stack>
              <Typography variant="body1" textTransform="capitalize" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {weather[0].description}
              </Typography>
            </Stack>

            {/* Weather Stats Section */}
            <Stack
              direction="row"
              justifyContent="space-around"
              spacing={1}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                padding: 2,
                boxShadow: theme.shadows[0],
              }}
            >
              {[
                { label: "Humidity", value: `${main.humidity}%` },
                { label: "Wind", value: `${wind.speed} m/s` },
                { label: "Feels Like", value: `${Math.round(main.feels_like)}°` },
              ].map((stat) => (
                <Stack key={stat.label} alignItems="center" spacing={0.5}>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {stat.label}
                  </Typography>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {stat.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Hourly Forecast Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Hourly Forecast
              </Typography>
              <HourlyScroll>
                {forecastData.list.slice(0, 8).map((hour) => {
                  const HourIcon = WEATHER_ICONS[hour.weather[0].main] || WEATHER_ICONS.Default;
                  return (
                    <Paper
                      key={hour.dt}
                      sx={{
                        p: 1.5,
                        minWidth: 70,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        boxShadow: theme.shadows[0],
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                        {formatTime(hour.dt)}
                      </Typography>
                      <Box sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        {HourIcon}
                      </Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {Math.round(hour.main.temp)}°
                      </Typography>
                    </Paper>
                  );
                })}
              </HourlyScroll>
            </Box>

            {/* 5-Day Forecast Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                5-Day Forecast
              </Typography>
              <WeeklyScroll>
                {forecastData.list
                  .filter((_, index) => index % 8 === 0) // Get one forecast per day (every 8th item)
                  .slice(0, 5) // Limit to 5 days
                  .map((day) => {
                    const DayIcon = WEATHER_ICONS[day.weather[0].main] || WEATHER_ICONS.Default;
                    return (
                      <Paper
                        key={day.dt}
                        sx={{
                          p: 1,
                          minWidth: 70,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          boxShadow: theme.shadows[0],
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                          {formatDay(day.dt)}
                        </Typography>
                        <Box sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                          {DayIcon}
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {Math.round(day.main.temp_max)}°
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {Math.round(day.main.temp_min)}°
                          </Typography>
                        </Stack>
                      </Paper>
                    );
                  })}
              </WeeklyScroll>
            </Box>
          </Stack>
        </WeatherCard>
      </WeatherContainer>

      {/* Bottom Navigation */}
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
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/timetable"
          label="Timetable" 
          icon={<EventIcon />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/travel"
          label="Travel" 
          icon={<DirectionsCarIcon />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
        <BottomNavigationAction 
          component={Link}
          to="/weather"
          label="Weather" 
          icon={<WbSunnyIcon />} 
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }
          }}
        />
      </BottomNavigation>
    </>
  );
}