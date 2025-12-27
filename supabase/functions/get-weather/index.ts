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

    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeatherMap API error:', response.status, errorText);
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Weather data received:', JSON.stringify(data));

    // Map OpenWeatherMap conditions to our app's conditions
    const conditionMap: Record<string, string> = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'rainy',
      'Snow': 'cloudy',
      'Mist': 'partly-cloudy',
      'Fog': 'partly-cloudy',
      'Haze': 'partly-cloudy',
    };

    const mainCondition = data.weather[0]?.main || 'Clear';
    const condition = conditionMap[mainCondition] || 'partly-cloudy';

    // Convert wind direction from degrees to cardinal
    const windDeg = data.wind?.deg || 0;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDirection = directions[Math.round(windDeg / 45) % 8];

    const weatherData = {
      condition,
      temperature: Math.round(data.main?.temp || 0),
      feelsLike: Math.round(data.main?.feels_like || 0),
      humidity: data.main?.humidity || 0,
      windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s to km/h
      windDirection,
      visibility: Math.round((data.visibility || 10000) / 1000), // m to km
      uvIndex: 5, // OpenWeatherMap free tier doesn't include UV, we'll estimate
      description: data.weather[0]?.description || '',
    };

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-weather function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
