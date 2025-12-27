import { useState } from "react";
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { DatePicker } from "@/components/DatePicker";
import { TideTable } from "@/components/TideTable";
import { WeatherForecast } from "@/components/WeatherForecast";
import { FishForecast } from "@/components/FishForecast";
import { WindForecast } from "@/components/WindForecast";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getDefaultLocation, type Location } from "@/lib/locations";
import { Loader2, AlertCircle } from "lucide-react";

const Index = () => {
  const [location, setLocation] = useState<Location>(getDefaultLocation());
  const [date, setDate] = useState(new Date());

  const { weather, tides, wind, fishForecast, loading, error, usingMockData } = useWeatherData({
    lat: location.lat,
    lon: location.lon,
    date,
    locationName: location.name,
  });

  return (
    <div className="min-h-screen sky-gradient">
      <Header />
      
      <main className="container mx-auto max-w-lg px-4 pb-8">
        {/* Pull up the cards to overlap with header */}
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
              {(error || usingMockData) && (
                <div className="glass-card rounded-xl p-4 shadow-card flex items-center gap-3 bg-sun/10">
                  <AlertCircle className="h-5 w-5 text-sun shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {error || "Alguns dados são ilustrativos. Verifique suas chaves de API."}
                  </p>
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
              ? "Dados ilustrativos. Para informações precisas, consulte fontes oficiais."
              : "Dados fornecidos por OpenWeatherMap e WorldTides."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
