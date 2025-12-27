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
    const { lat, lon, date } = await req.json();
    const apiKey = Deno.env.get('WORLDTIDES_API_KEY');

    if (!apiKey) {
      console.error('WorldTides API key not configured');
      throw new Error('API key not configured');
    }

    // Parse the date and create start/end timestamps
    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    console.log(`Fetching tides for coordinates: ${lat}, ${lon}, date: ${date}`);

    const response = await fetch(
      `https://www.worldtides.info/api/v3?extremes&lat=${lat}&lon=${lon}&start=${Math.floor(startDate.getTime() / 1000)}&end=${Math.floor(endDate.getTime() / 1000)}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WorldTides API error:', response.status, errorText);
      throw new Error(`Tides API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tides data received:', JSON.stringify(data));

    if (data.error) {
      console.error('WorldTides API returned error:', data.error);
      throw new Error(data.error);
    }

    // Transform the data to match our app's format
    const tides = (data.extremes || []).map((extreme: any) => {
      const tideDate = new Date(extreme.date);
      const hours = tideDate.getHours().toString().padStart(2, '0');
      const minutes = tideDate.getMinutes().toString().padStart(2, '0');
      
      return {
        time: `${hours}:${minutes}`,
        height: Math.round(extreme.height * 100) / 100, // Round to 2 decimal places
        type: extreme.type === 'High' ? 'high' : 'low',
      };
    });

    return new Response(JSON.stringify({ tides, station: data.station }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-tides function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
