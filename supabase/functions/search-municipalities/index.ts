import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IBGEMunicipio {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
}

interface MunicipioResult {
  name: string;
  lat: number;
  lon: number;
}

// Cache for all municipalities (loaded once)
let municipiosCache: IBGEMunicipio[] | null = null;

async function loadMunicipios(): Promise<IBGEMunicipio[]> {
  if (municipiosCache) {
    return municipiosCache;
  }

  console.log("Loading all municipalities from IBGE...");
  const response = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
  );

  if (!response.ok) {
    throw new Error(`IBGE API error: ${response.status}`);
  }

  municipiosCache = await response.json();
  console.log(`Loaded ${municipiosCache?.length} municipalities`);
  return municipiosCache!;
}

async function getCoordinates(municipioNome: string, uf: string): Promise<{ lat: number; lon: number } | null> {
  try {
    // Use Nominatim (OpenStreetMap) for geocoding - it's free
    const query = encodeURIComponent(`${municipioNome}, ${uf}, Brasil`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=br`,
      {
        headers: {
          'User-Agent': 'FishingApp/1.0'
        }
      }
    );

    if (!response.ok) {
      console.warn(`Nominatim error for ${municipioNome}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.warn(`Error getting coordinates for ${municipioNome}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 10 } = await req.json();
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ municipalities: [], error: "Query must be at least 2 characters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for: ${query}`);

    // Load all municipalities
    const allMunicipios = await loadMunicipios();

    // Filter by search query (case-insensitive)
    const searchLower = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filtered = allMunicipios.filter(m => {
      const nomeLower = m.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return nomeLower.includes(searchLower);
    }).slice(0, limit);

    // Get coordinates for each result
    const results: MunicipioResult[] = [];
    
    for (const municipio of filtered) {
      const uf = municipio.microrregiao.mesorregiao.UF.sigla;
      const coords = await getCoordinates(municipio.nome, uf);
      
      if (coords) {
        results.push({
          name: `${municipio.nome}, ${uf}`,
          lat: coords.lat,
          lon: coords.lon,
        });
      } else {
        // Fallback to approximate center of Brazil if geocoding fails
        results.push({
          name: `${municipio.nome}, ${uf}`,
          lat: -15.7801,
          lon: -47.9292,
        });
      }
    }

    console.log(`Found ${results.length} municipalities for "${query}"`);

    return new Response(
      JSON.stringify({ municipalities: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error searching municipalities:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search municipalities';
    return new Response(
      JSON.stringify({ 
        municipalities: [], 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
