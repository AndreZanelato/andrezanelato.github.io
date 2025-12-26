import { Wind, Compass, Gauge, ArrowUp, Clock } from "lucide-react";

interface WindData {
  speed: number;
  gustSpeed: number;
  direction: string;
  directionDegrees: number;
  beaufortScale: number;
  beaufortDescription: string;
  hourlyForecast: {
    time: string;
    speed: number;
    direction: string;
  }[];
}

interface WindForecastProps {
  wind: WindData;
}

const getWindIntensityColor = (speed: number) => {
  if (speed < 12) return "text-green-500";
  if (speed < 20) return "text-primary";
  if (speed < 30) return "text-sun";
  return "text-red-500";
};

const getWindIntensityBg = (speed: number) => {
  if (speed < 12) return "bg-green-500/20";
  if (speed < 20) return "bg-primary/20";
  if (speed < 30) return "bg-sun/20";
  return "bg-red-500/20";
};

export function WindForecast({ wind }: WindForecastProps) {
  return (
    <div className="glass-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Wind className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Previsão de Vento</h2>
          <p className="text-xs text-muted-foreground">Condições atuais e previsão</p>
        </div>
      </div>

      {/* Main wind display */}
      <div className={`mb-5 flex items-center justify-between rounded-xl ${getWindIntensityBg(wind.speed)} p-5`}>
        <div className="flex items-center gap-4">
          <div 
            className="relative"
            style={{ transform: `rotate(${wind.directionDegrees}deg)` }}
          >
            <ArrowUp className={`h-12 w-12 ${getWindIntensityColor(wind.speed)}`} />
          </div>
          <div>
            <p className={`text-3xl font-bold ${getWindIntensityColor(wind.speed)}`}>
              {wind.speed} <span className="text-lg">km/h</span>
            </p>
            <p className="text-sm text-muted-foreground">{wind.direction}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Rajadas</p>
          <p className="text-xl font-semibold">{wind.gustSpeed} km/h</p>
        </div>
      </div>

      {/* Beaufort scale */}
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Escala Beaufort</p>
              <p className="text-sm font-semibold">Força {wind.beaufortScale}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{wind.beaufortDescription}</p>
        </div>
      </div>

      {/* Direction compass */}
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <Compass className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Direção</p>
            <p className="text-sm font-semibold">{wind.direction} ({wind.directionDegrees}°)</p>
          </div>
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Previsão Horária</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {wind.hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="flex min-w-[70px] flex-col items-center rounded-lg bg-background/50 p-3"
            >
              <p className="text-xs text-muted-foreground">{hour.time}</p>
              <ArrowUp 
                className={`my-1 h-4 w-4 ${getWindIntensityColor(hour.speed)}`}
                style={{ transform: `rotate(${["N", "NE", "E", "SE", "S", "SW", "W", "NW"].indexOf(hour.direction) * 45}deg)` }}
              />
              <p className={`text-sm font-semibold ${getWindIntensityColor(hour.speed)}`}>
                {hour.speed}
              </p>
              <p className="text-xs text-muted-foreground">{hour.direction}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
