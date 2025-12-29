import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, Eye, Sunrise, Sunset, Gauge } from "lucide-react";

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy";
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  description?: string;
  sunrise: string;
  sunset: string;
  dayLength: string;
}

interface WeatherForecastProps {
  weather: WeatherData;
}

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": Cloud,
};

const conditionLabels = {
  sunny: "Ensolarado",
  cloudy: "Nublado",
  rainy: "Chuvoso",
  "partly-cloudy": "Parcialmente Nublado",
};

const conditionColors = {
  sunny: "text-sun",
  cloudy: "text-cloud",
  rainy: "text-primary",
  "partly-cloudy": "text-muted-foreground",
};

export function WeatherForecast({ weather }: WeatherForecastProps) {
  const Icon = conditionIcons[weather.condition];

  return (
    <div className="glass-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sun/20">
          <Sun className="h-5 w-5 text-sun" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Previsão do Tempo</h2>
          <p className="text-xs text-muted-foreground">
            {weather.description ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1) : "Condições atuais"}
          </p>
        </div>
      </div>

      {/* Main weather display */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-5">
        <div className="flex items-center gap-4">
          <div className={`animate-float ${conditionColors[weather.condition]}`}>
            <Icon className="h-16 w-16" />
          </div>
          <div>
            <p className="text-4xl font-bold">{weather.temperature}°</p>
            <p className="text-sm text-muted-foreground">
              {conditionLabels[weather.condition]}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Sensação</p>
          <p className="text-2xl font-semibold">{weather.feelsLike}°</p>
        </div>
      </div>

      {/* Sun times */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-sun/10 to-orange-500/10 p-4">
        <div className="flex items-center gap-3">
          <Sunrise className="h-5 w-5 text-sun" />
          <div>
            <p className="text-xs text-muted-foreground">Nascer do Sol</p>
            <p className="text-sm font-semibold">{weather.sunrise}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Duração do Dia</p>
          <p className="text-sm font-semibold">{weather.dayLength}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Pôr do Sol</p>
            <p className="text-sm font-semibold">{weather.sunset}</p>
          </div>
          <Sunset className="h-5 w-5 text-orange-500" />
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Wind className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Vento</p>
            <p className="text-sm font-semibold">
              {weather.windSpeed} km/h {weather.windDirection}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Droplets className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Umidade</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Gauge className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Pressão</p>
            <p className="text-sm font-semibold">{weather.pressure} hPa</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Eye className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Visibilidade</p>
            <p className="text-sm font-semibold">{weather.visibility} km</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Thermometer className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Índice UV</p>
            <p className="text-sm font-semibold">{weather.uvIndex}</p>
          </div>
        </div>
      </div>
    </div>
  );
}