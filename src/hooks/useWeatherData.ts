import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateWeatherData, generateTideData, generateWindData, generateFishForecastData } from "@/lib/mockData";
import type { WeatherData, TideData, WindData, FishForecastData } from "@/lib/mockData";

interface UseWeatherDataProps {
  lat: number;
  lon: number;
  date: Date;
  locationName: string;
}

interface WeatherState {
  weather: WeatherData | null;
  tides: TideData[];
  wind: WindData | null;
  fishForecast: FishForecastData | null;
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
}

export function useWeatherData({ lat, lon, date, locationName }: UseWeatherDataProps): WeatherState {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    tides: [],
    wind: null,
    fishForecast: null,
    loading: true,
    error: null,
    usingMockData: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch all data in parallel
        const [weatherResult, tidesResult, windResult] = await Promise.all([
          supabase.functions.invoke('get-weather', {
            body: { lat, lon },
          }),
          supabase.functions.invoke('get-tides', {
            body: { lat, lon, date: date.toISOString() },
          }),
          supabase.functions.invoke('get-wind', {
            body: { lat, lon },
          }),
        ]);

        let weather: WeatherData | null = null;
        let tides: TideData[] = [];
        let wind: WindData | null = null;
        let usingMockData = false;

        // Process weather data
        if (weatherResult.error || weatherResult.data?.error) {
          console.warn('Weather API failed, using mock data:', weatherResult.error || weatherResult.data?.error);
          weather = generateWeatherData(date, locationName);
          usingMockData = true;
        } else {
          weather = weatherResult.data;
        }

        // Process tides data
        if (tidesResult.error || tidesResult.data?.error || !tidesResult.data?.tides?.length) {
          console.warn('Tides API failed, using mock data:', tidesResult.error || tidesResult.data?.error);
          tides = generateTideData(date);
          usingMockData = true;
        } else {
          tides = tidesResult.data.tides;
        }

        // Process wind data
        if (windResult.error || windResult.data?.error) {
          console.warn('Wind API failed, using mock data:', windResult.error || windResult.data?.error);
          wind = generateWindData(date);
          usingMockData = true;
        } else {
          wind = windResult.data;
        }

        // Fish forecast is always generated locally (based on other conditions)
        const fishForecast = generateFishForecastData(date, locationName);

        setState({
          weather,
          tides,
          wind,
          fishForecast,
          loading: false,
          error: null,
          usingMockData,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Fallback to mock data
        setState({
          weather: generateWeatherData(date, locationName),
          tides: generateTideData(date),
          wind: generateWindData(date),
          fishForecast: generateFishForecastData(date, locationName),
          loading: false,
          error: 'Não foi possível obter dados em tempo real. Exibindo dados ilustrativos.',
          usingMockData: true,
        });
      }
    };

    fetchData();
  }, [lat, lon, date.toDateString(), locationName]);

  return state;
}
