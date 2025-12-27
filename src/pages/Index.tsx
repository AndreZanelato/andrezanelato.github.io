import { useState } from "react";
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { DatePicker } from "@/components/DatePicker";
import { TideTable } from "@/components/TideTable";
import { WeatherForecast } from "@/components/WeatherForecast";
import { FishForecast } from "@/components/FishForecast";
import { WindForecast } from "@/components/WindForecast";
import { useWeatherData, type ApiStatus } from "@/hooks/useWeatherData";
import { getDefaultLocation, type Location } from "@/lib/locations";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
  const [location, setLocation] = useState<Location>(getDefaultLocation());
  const [date, setDate] = useState(new Date());

  const { weather, tides, wind, fishForecast, loading, error, usingMockData, apiStatuses } = useWeatherData({
    lat: location.lat,
    lon: location.lon,
    date,
    locationName: location.name,
  });

  const hasErrors = apiStatuses.some(s => s.status === 'error');

  return (
    <div className="min-h-screen sky-gradient">
      <Header />
      
      <main className="container mx-auto max-w-lg px-4 pb-8">
        <div className="-mt-4 space-y-4">
          <LocationSearch
            location={location}
            onLocationChange={setLocation}
          />

          <DatePicker
            date={date}
            onDateChange={setDate}
          />

          {loading ? (
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

          {/* Footer note */}
          <p className="pt-4 text-center text-xs text-muted-foreground">
            {usingMockData 
              ? "Alguns dados são ilustrativos. Para informações precisas, consulte fontes oficiais."
              : "Dados fornecidos por OpenWeatherMap e WorldTides."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
