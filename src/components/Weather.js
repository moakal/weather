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

// Styled components with better mobile padding
const WeatherContainer = styled(Box)(({ background }) => ({
  minHeight: "100vh",
  background: background,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "background 0.5s ease",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
}));

const WeatherCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.75)' 
    : 'rgba(255, 255, 255, 0)',
  backdropFilter: "blur(2px)",
  width: "100%",
  maxWidth: "450px",
  margin: 0,
  boxShadow: theme.shadows[0],
}));

const HourlyScroll = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  marginLeft: "-8px",
  marginRight: "-8px",
  paddingLeft: "8px",
  paddingRight: "8px",
}));

// Updated WeeklyScroll to be responsive and scale with screen size
const WeeklyScroll = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)", // Always 5 columns
  gap: theme.spacing(1.5), // Adjusted gap
  width: "100%",
  overflow: "hidden",
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1), // Smaller gap on mobile
  },
}));

// Weather backgrounds configuration
const weatherBackgrounds = {
  Clear: "url('/images/clear-sky.jpg')",
  Clouds: "url('/images/cloudy.jpg')",
  Rain: "url('/images/rainy.jpg')",
  Snow: "url('/images/snowy.jpg')",
  Thunderstorm: "url('/images/thunderstorm.jpg')",
  Default: "url('/images/default.jpg')",
};

// Weather icons mapping with larger size for mobile
const weatherIcons = {
  Clear: <WiDaySunny size={56} />,
  Clouds: <WiCloud size={56} />,
  Rain: <WiRain size={56} />,
  Snow: <WiSnow size={56} />,
  Thunderstorm: <WiThunderstorm size={56} />,
  Default: <WiCloud size={56} />,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchData = useCallback(async (lat, lon) => {
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
        ),
      ]);

      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchData(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, [fetchData]);

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    
  const formatDay = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString([], { weekday: "short" });

  if (loading) {
    return (
      <WeatherContainer background={weatherBackgrounds.Default}>
        <CircularProgress size={60} />
      </WeatherContainer>
    );
  }

  if (error) {
    return (
      <WeatherContainer background={weatherBackgrounds.Default}>
        <WeatherCard>
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        </WeatherCard>
      </WeatherContainer>
    );
  }

  const { name, main, weather, wind } = weatherData;
  const weatherType = weather[0].main;
  const background = weatherBackgrounds[weatherType] || weatherBackgrounds.Default;

  return (
    <WeatherContainer background={background}>
      <WeatherCard>
        <Stack spacing={3}>
          {/* Current Weather */}
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h5" component="h1" fontWeight="bold">
              {name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              {weatherIcons[weatherType] || weatherIcons.Default}
              <Typography variant="h2" component="div">
                {Math.round(main.temp)}°
              </Typography>
            </Stack>
            <Typography variant="body1" textTransform="capitalize">
              {weather[0].description}
            </Typography>
          </Stack>

          {/* Stats Row */}
          <Stack 
            direction="row" 
            justifyContent="space-around"
            spacing={1}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              padding: 2,
              boxShadow: theme.shadows[0],
            }}
          >
            <Stack alignItems="center" spacing={0.5}>
              <Typography variant="caption">Humidity</Typography>
              <Typography fontWeight="bold">{main.humidity}%</Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
              <Typography variant="caption">Wind</Typography>
              <Typography fontWeight="bold">{wind.speed} m/s</Typography>
            </Stack>
            <Stack alignItems="center" spacing={0.5}>
              <Typography variant="caption">Feels Like</Typography>
              <Typography fontWeight="bold">{Math.round(main.feels_like)}°</Typography>
            </Stack>
          </Stack>

          {/* Hourly Forecast */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Hourly Forecast
            </Typography>
            <HourlyScroll>
              {forecastData.list.slice(0, 8).map((hour) => (
                <Paper
                  key={hour.dt}
                  sx={{
                    p: 1.5,
                    minWidth: 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    boxShadow: theme.shadows[0],
                  }}
                >
                  <Typography variant="caption">{formatTime(hour.dt)}</Typography>
                  {weatherIcons[hour.weather[0].main] || weatherIcons.Default}
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(hour.main.temp)}°
                  </Typography>
                </Paper>
              ))}
            </HourlyScroll>
          </Box>

          {/* Daily Forecast - Now responsive without scrolling */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              5-Day Forecast
            </Typography>
            <WeeklyScroll>
              {forecastData.list
                .filter((_, index) => index % 8 === 0)
                .slice(0, 5)
                .map((day) => (
                  <Paper
                    key={day.dt}
                    sx={{
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      [theme.breakpoints.down('sm')]: {
                        p: 0.5, // Smaller padding on mobile
                      },
                      boxShadow: theme.shadows[0],

                    }}
                  >
                    <Typography variant="caption" fontSize="0.75rem">
                      {formatDay(day.dt)}
                    </Typography>
                    <Box sx={{ fontSize: '1.5rem' }}>
                      {weatherIcons[day.weather[0].main] || weatherIcons.Default}
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <Typography variant="body2" fontWeight="bold" fontSize="0.875rem">
                        {Math.round(day.main.temp_max)}°
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                        {Math.round(day.main.temp_min)}°
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
            </WeeklyScroll>
          </Box>
        </Stack>
      </WeatherCard>
    </WeatherContainer>
  );
};

export default Weather;