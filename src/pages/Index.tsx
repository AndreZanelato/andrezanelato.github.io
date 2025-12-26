import { useState } from "react";
import { Header } from "@/components/Header";
import { LocationSearch } from "@/components/LocationSearch";
import { DatePicker } from "@/components/DatePicker";
import { TideTable } from "@/components/TideTable";
import { WeatherForecast } from "@/components/WeatherForecast";
import { generateTideData, generateWeatherData } from "@/lib/mockData";

const Index = () => {
  const [location, setLocation] = useState("Santos, SP");
  const [date, setDate] = useState(new Date());

  const tideData = generateTideData(date);
  const weatherData = generateWeatherData(date, location);

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

          <TideTable tides={tideData} />

          <WeatherForecast weather={weatherData} />

          {/* Footer note */}
          <p className="pt-4 text-center text-xs text-muted-foreground">
            Dados ilustrativos. Para informações precisas, consulte fontes oficiais como a Marinha do Brasil.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
