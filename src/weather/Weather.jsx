import { useState, useEffect } from "react";
import "./weather.css";
import axios from "axios";

const apiKey = "73db1f3cb5cfcd88df62bd75bb8c57e3";

const LocationSearch = ({ locationChange }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(location.trim() !== "") {
      locationChange(location.trim());
      setLocation("");
    }
  };

  return (
    <form className="location-search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City, Country"
        className="location-search-input"
      />
    </form>
  );
};

const WeatherInfo = ({ weatherInfo }) => {
  const celsiusTemperature = Math.floor(weatherInfo.main.temp - 273);
  const celsiusFeelsLikeTemperature = Math.floor(weatherInfo.main.feels_like - 273);

  return (
    <div className="weather-info">
      <img
        className="weather-info-image"
        src={`/${weatherInfo.weather[0].icon}.png`}
        alt={weatherInfo.weather[0].description}
      />
      <div className="weather-info-temp">{celsiusTemperature} °C</div>
      <div className="weather-info-name">{weatherInfo.name}</div>
      <div className="weather-info-details">
         <div className="weather-info-detail">
  <b>Feels like:</b> <span className="nowrap-text">{celsiusFeelsLikeTemperature} °C</span>
</div>
<div className="weather-info-detail">
  <b>Humidity:</b> <span className="nowrap-text">{weatherInfo.main.humidity}%</span>
</div>
<div className="weather-info-detail">
  <b>Wind speed:</b> <span className="nowrap-text">{weatherInfo.wind.speed} km/h</span>
</div>

      </div>
    </div>
  );
};

const Weather = () => {
  const [location, setLocation] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    setLoading(true);
    setError(null);

    axios
      .get(url)
      .then((response) => {
        setWeatherInfo(response.data);
        setError(null);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setError("City not found. Please check the spelling and try again.");
          } else {
            setError(`Error: ${error.response.status} - ${error.response.statusText}`);
          }
        } else if (error.request) {
          setError("Network error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
        setWeatherInfo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location]);

  return (
    <div className="weather-block">
      <h1>🌤️ Weather App</h1>
      <LocationSearch locationChange={(loc) => setLocation(loc)} />

      {loading && <div>Loading...</div>}

      {error && <div className="error-message">{error}</div>}

      {weatherInfo && !error && <WeatherInfo weatherInfo={weatherInfo} />}
    </div>
  );
};

export default Weather;
