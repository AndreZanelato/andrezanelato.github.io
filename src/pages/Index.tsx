import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { DatePicker } from "@/components/DatePicker";
import { TideTable } from "@/components/TideTable";
import { WeatherForecast } from "@/components/WeatherForecast";
import { FishForecast } from "@/components/FishForecast";
import { WindForecast } from "@/components/WindForecast";
import { useWeatherData, type ApiStatus } from "@/hooks/useWeatherData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { type Location } from "@/lib/locations";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Navigation, ExternalLink } from "lucide-react";

function ApiStatusBadge({ status }: { status: ApiStatus }) {
  if (status.status === 'ok') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        <span className="text-muted-foreground">{status.name}:</span>
        <span className="text-green-600 dark:text-green-400">{status.source}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <XCircle className="h-3.5 w-3.5 text-destructive" />
      <span className="text-muted-foreground">{status.name}:</span>
      <span className="text-destructive">{status.source} (falhou)</span>
    </div>
  );
}

const Index = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [date, setDate] = useState(new Date());
  const [geoLocationApplied, setGeoLocationApplied] = useState(false);
  
  const geolocation = useGeolocation();

  // Apply geolocation when available
  useEffect(() => {
    async function reverseGeocode() {
      if (geolocation.latitude && geolocation.longitude && !geoLocationApplied) {
        try {
          // Try to get municipality name via reverse geocoding
          const { data } = await supabase.functions.invoke('search-municipalities', {
            body: { 
              lat: geolocation.latitude, 
              lon: geolocation.longitude,
              reverse: true 
            },
          });

          if (data?.name) {
            setLocation({
              name: data.name,
              lat: geolocation.latitude,
              lon: geolocation.longitude,
            });
          } else {
            // Fallback: just use coordinates with generic name
            setLocation({
              name: "Sua localização",
              lat: geolocation.latitude,
              lon: geolocation.longitude,
            });
          }
          setGeoLocationApplied(true);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          // Fallback without name
          setLocation({
            name: "Sua localização",
            lat: geolocation.latitude,
            lon: geolocation.longitude,
          });
          setGeoLocationApplied(true);
        }
      }
    }

    reverseGeocode();
  }, [geolocation.latitude, geolocation.longitude, geoLocationApplied]);

  // Set default location only if geolocation failed
  useEffect(() => {
    if (!geolocation.loading && geolocation.error && !location) {
      setLocation({
        name: "Santos, SP",
        lat: -23.9608,
        lon: -46.3336,
      });
    }
  }, [geolocation.loading, geolocation.error, location]);

  const { weather, tides, wind, fishForecast, loading, error, usingMockData, apiStatuses } = useWeatherData({
    lat: location?.lat ?? -23.9608,
    lon: location?.lon ?? -46.3336,
    date,
    locationName: location?.name ?? "Santos, SP",
  });

  const hasErrors = apiStatuses.some(s => s.status === 'error');

  // Show loading while waiting for geolocation
  const isInitializing = geolocation.loading || (!location && !geolocation.error);

  return (
    <div className="min-h-screen sky-gradient">
      <Header />
      
      <main className="container mx-auto max-w-lg px-4 pb-8">
        <div className="-mt-4 space-y-4">
          {/* Geolocation status */}
          {isInitializing && (
            <div className="glass-card rounded-xl p-3 shadow-card flex items-center gap-3">
              <Navigation className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Detectando sua localização...</span>
            </div>
          )}

          {location && (
            <LocationSearch
              location={location}
              onLocationChange={(loc) => {
                setLocation(loc);
                setGeoLocationApplied(true); // Prevent geolocation override
              }}
            />
          )}

          <DatePicker
            date={date}
            onDateChange={setDate}
          />

          {loading || isInitializing ? (
            <div className="glass-card rounded-xl p-8 shadow-card flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <>
              {/* API Status Panel */}
              {hasErrors && (
                <div className="glass-card rounded-xl p-4 shadow-card space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-sun" />
                    <span className="text-xs font-medium text-foreground">Status das APIs</span>
                  </div>
                  <div className="space-y-1.5">
                    {apiStatuses.map((status) => (
                      <ApiStatusBadge key={status.name} status={status} />
                    ))}
                  </div>
                  {usingMockData && (
                    <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
                      Dados ilustrativos sendo exibidos para APIs com falha.
                    </p>
                  )}
                </div>
              )}

              {weather && <WeatherForecast weather={weather} />}

              {tides.length > 0 && <TideTable tides={tides} />}

              {wind && <WindForecast wind={wind} />}

              {fishForecast && <FishForecast forecast={fishForecast} />}
            </>
          )}

          {/* Footer */}
          <footer className="pt-6 pb-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs">
              <Link 
                to="/apis" 
                className="text-primary hover:underline flex items-center gap-1"
              >
                APIs
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span className="text-muted-foreground">•</span>
              <a 
                href="https://www.andrezanelato.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Desenvolvido por André Zanelato
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              {usingMockData 
                ? "Alguns dados são ilustrativos. Para informações precisas, consulte fontes oficiais."
                : "Dados fornecidos por OpenWeatherMap e WorldTides."}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
