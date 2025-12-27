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

export interface ApiStatus {
  name: string;
  status: 'ok' | 'error' | 'loading';
  source: string;
  error?: string;
}

interface WeatherState {
  weather: WeatherData | null;
  tides: TideData[];
  wind: WindData | null;
  fishForecast: FishForecastData | null;
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
  apiStatuses: ApiStatus[];
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
    apiStatuses: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const apiStatuses: ApiStatus[] = [
        { name: 'Clima', status: 'loading', source: 'OpenWeatherMap' },
        { name: 'Marés', status: 'loading', source: 'WorldTides' },
        { name: 'Vento', status: 'loading', source: 'OpenWeatherMap' },
      ];

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
          const errorMsg = weatherResult.error?.message || weatherResult.data?.error || 'Falha na conexão';
          console.warn('Weather API failed:', errorMsg);
          weather = generateWeatherData(date, locationName);
          usingMockData = true;
          apiStatuses[0] = { name: 'Clima', status: 'error', source: 'OpenWeatherMap', error: errorMsg };
        } else {
          weather = weatherResult.data;
          apiStatuses[0] = { name: 'Clima', status: 'ok', source: 'OpenWeatherMap' };
        }

        // Process tides data
        if (tidesResult.error || tidesResult.data?.error || !tidesResult.data?.tides?.length) {
          const errorMsg = tidesResult.error?.message || tidesResult.data?.error || 'Sem dados disponíveis';
          console.warn('Tides API failed:', errorMsg);
          tides = generateTideData(date);
          usingMockData = true;
          apiStatuses[1] = { name: 'Marés', status: 'error', source: 'WorldTides', error: errorMsg };
        } else {
          tides = tidesResult.data.tides;
          apiStatuses[1] = { name: 'Marés', status: 'ok', source: 'WorldTides' };
        }

        // Process wind data
        if (windResult.error || windResult.data?.error) {
          const errorMsg = windResult.error?.message || windResult.data?.error || 'Falha na conexão';
          console.warn('Wind API failed:', errorMsg);
          wind = generateWindData(date);
          usingMockData = true;
          apiStatuses[2] = { name: 'Vento', status: 'error', source: 'OpenWeatherMap', error: errorMsg };
        } else {
          wind = windResult.data;
          apiStatuses[2] = { name: 'Vento', status: 'ok', source: 'OpenWeatherMap' };
        }

        // Fish forecast is always generated locally
        const fishForecast = generateFishForecastData(date, locationName);

        setState({
          weather,
          tides,
          wind,
          fishForecast,
          loading: false,
          error: null,
          usingMockData,
          apiStatuses,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        
        const failedStatuses: ApiStatus[] = [
          { name: 'Clima', status: 'error', source: 'OpenWeatherMap', error: 'Conexão falhou' },
          { name: 'Marés', status: 'error', source: 'WorldTides', error: 'Conexão falhou' },
          { name: 'Vento', status: 'error', source: 'OpenWeatherMap', error: 'Conexão falhou' },
        ];

        setState({
          weather: generateWeatherData(date, locationName),
          tides: generateTideData(date),
          wind: generateWindData(date),
          fishForecast: generateFishForecastData(date, locationName),
          loading: false,
          error: 'Não foi possível obter dados em tempo real.',
          usingMockData: true,
          apiStatuses: failedStatuses,
        });
      }
    };

    fetchData();
  }, [lat, lon, date.toDateString(), locationName]);

  return state;
}
