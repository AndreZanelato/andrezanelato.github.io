import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon } = await req.json();
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');

    if (!apiKey) {
      console.error('OpenWeatherMap API key not configured');
      throw new Error('API key not configured');
    }

    console.log(`Fetching wind forecast for coordinates: ${lat}, ${lon}`);

    // Get current weather and forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=8`
      ),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      console.error('OpenWeatherMap API error');
      throw new Error('Weather API error');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('Wind data received');

    // Convert wind direction from degrees to cardinal
    const windDeg = currentData.wind?.deg || 0;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const directionIndex = Math.round(windDeg / 45) % 8;
    const windDirection = directions[directionIndex];

    // Convert m/s to km/h
    const speed = Math.round((currentData.wind?.speed || 0) * 3.6);
    const gustSpeed = Math.round((currentData.wind?.gust || currentData.wind?.speed * 1.3 || 0) * 3.6);

    // Calculate Beaufort scale
    const beaufortDescriptions = [
      'Calmaria', 'Aragem', 'Brisa leve', 'Brisa fraca', 'Brisa moderada',
      'Brisa forte', 'Vento fresco', 'Vento forte', 'Ventania', 'Ventania forte',
      'Tempestade', 'Tempestade violenta', 'Furacão'
    ];
    
    const getBeaufortScale = (speedKmh: number): number => {
      if (speedKmh < 1) return 0;
      if (speedKmh < 6) return 1;
      if (speedKmh < 12) return 2;
      if (speedKmh < 20) return 3;
      if (speedKmh < 29) return 4;
      if (speedKmh < 39) return 5;
      if (speedKmh < 50) return 6;
      if (speedKmh < 62) return 7;
      if (speedKmh < 75) return 8;
      if (speedKmh < 89) return 9;
      if (speedKmh < 103) return 10;
      if (speedKmh < 118) return 11;
      return 12;
    };

    const beaufortScale = getBeaufortScale(speed);

    // Build hourly forecast from the 3-hour forecast data
    const hourlyForecast = forecastData.list.slice(0, 6).map((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      const itemWindDeg = item.wind?.deg || 0;
      const itemDirIndex = Math.round(itemWindDeg / 45) % 8;
      
      return {
        time: `${itemDate.getHours().toString().padStart(2, '0')}:00`,
        speed: Math.round((item.wind?.speed || 0) * 3.6),
        direction: directions[itemDirIndex],
      };
    });

    const windData = {
      speed,
      gustSpeed,
      direction: windDirection,
      directionDegrees: windDeg,
      beaufortScale,
      beaufortDescription: beaufortDescriptions[beaufortScale],
      hourlyForecast,
    };

    return new Response(JSON.stringify(windData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-wind function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
