import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Weather } from '../interfaces/IWeather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const API_KEY = process.env.WEATHER_API_KEY;

interface WeatherInfoProps {
  latitude: number;
  longitude: number;
  containerStyle?: ViewStyle;
  weatherTextStyle?: ViewStyle;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ latitude, longitude, containerStyle, weatherTextStyle }) => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeather({
          temperature: data.main.temp,
          weather: data.weather[0].main,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error('Error getting weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return weather ? (
    <View style={[weather.temperature >= 26 ? styles.warmContainer : styles.coldContainer, containerStyle]}>
      <View style={styles.temperatureContainer}>
        <MCIcon name="thermometer" size={20} color="#333" />
        <Text style={styles.weatherText}>{weather.temperature}°C</Text>
      </View>
      <View style={styles.temperatureContainer} >
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
        style={styles.weatherIcon}
      />
      <Text style={[styles.weatherMainText, weatherTextStyle]}>{weather.weather}</Text>
      </View>
    </View>
  ) : (
    <Text>Error loading weather data...</Text>
  );
};

const styles = StyleSheet.create({
  container: {
  width: 200,
  },
  warmContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    borderColor: '#ddd',
    backgroundColor: '#FFBC45',
  },
  coldContainer: {
    width: 300,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    borderColor: '#ddd',
    backgroundColor: '#B8DFFB',
  },
  weatherText: {
    fontSize: 16,
    color: '#000000',
  },
  weatherMainText: {
    fontSize: 16,
    color: '#000000',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  temperatureContainer: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
});

export default WeatherInfo;
