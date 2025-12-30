import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate mock tide data when API fails
function generateMockTides(date: Date): { time: string; height: number; type: 'high' | 'low' }[] {
  const baseHour = 6 + Math.floor(Math.random() * 2);
  const tides = [];
  
  for (let i = 0; i < 4; i++) {
    const hour = (baseHour + i * 6) % 24;
    const isHigh = i % 2 === 0;
    tides.push({
      time: `${hour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      height: isHigh ? 1.2 + Math.random() * 0.5 : 0.3 + Math.random() * 0.3,
      type: isHigh ? 'high' : 'low' as 'high' | 'low',
    });
  }
  
  return tides.sort((a, b) => a.time.localeCompare(b.time));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, date } = await req.json();
    const apiKey = Deno.env.get('WORLDTIDES_API_KEY');

    if (!apiKey) {
      console.warn('WorldTides API key not configured, using mock data');
      const mockTides = generateMockTides(new Date(date));
      return new Response(JSON.stringify({ tides: mockTides, station: 'Mock Station', isMock: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      console.warn('WorldTides API error:', response.status, errorText);
      
      // Return mock data instead of throwing error
      const mockTides = generateMockTides(targetDate);
      return new Response(JSON.stringify({ tides: mockTides, station: 'Dados Estimados', isMock: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Tides data received:', JSON.stringify(data));

    if (data.error) {
      console.warn('WorldTides API returned error:', data.error);
      const mockTides = generateMockTides(targetDate);
      return new Response(JSON.stringify({ tides: mockTides, station: 'Dados Estimados', isMock: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform the data to match our app's format
    const tides = (data.extremes || []).map((extreme: any) => {
      const tideDate = new Date(extreme.date);
      const hours = tideDate.getHours().toString().padStart(2, '0');
      const minutes = tideDate.getMinutes().toString().padStart(2, '0');
      
      return {
        time: `${hours}:${minutes}`,
        height: Math.round(extreme.height * 100) / 100,
        type: extreme.type === 'High' ? 'high' : 'low',
      };
    });

    // If no tides returned, use mock data
    if (tides.length === 0) {
      const mockTides = generateMockTides(targetDate);
      return new Response(JSON.stringify({ tides: mockTides, station: 'Dados Estimados', isMock: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ tides, station: data.station, isMock: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-tides function:', errorMessage);
    
    // Return mock data on any error
    const mockTides = generateMockTides(new Date());
    return new Response(JSON.stringify({ tides: mockTides, station: 'Dados Estimados', isMock: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
