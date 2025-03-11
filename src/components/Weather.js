import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch weather data');
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
          setError('Unable to retrieve your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, [fetchData]);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {weatherData ? (
        <>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Feels like: {weatherData.main.feels_like}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Pressure: {weatherData.main.pressure}</p>
          <p>Wind Speed: {weatherData.wind.speed}m/s</p>
        </>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
};

export default Weather;