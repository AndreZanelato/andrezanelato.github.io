import { Fish, Moon, Waves, Clock, ThumbsUp, ThumbsDown, Minus, Sun, Sunrise, Sunset } from "lucide-react";

interface SunMoonData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  dayLength: string;
}

interface FishForecastData {
  overallRating: "excellent" | "good" | "moderate" | "poor";
  bestTimes: string[];
  moonPhase: string;
  tideInfluence: string;
  tips: string[];
  sunMoon: SunMoonData;
}

interface FishForecastProps {
  forecast: FishForecastData;
}

const ratingConfig = {
  excellent: {
    label: "Excelente",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    icon: ThumbsUp,
  },
  good: {
    label: "Bom",
    color: "text-primary",
    bgColor: "bg-primary/20",
    icon: ThumbsUp,
  },
  moderate: {
    label: "Moderado",
    color: "text-sun",
    bgColor: "bg-sun/20",
    icon: Minus,
  },
  poor: {
    label: "Ruim",
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    icon: ThumbsDown,
  },
};

export function FishForecast({ forecast }: FishForecastProps) {
  const rating = ratingConfig[forecast.overallRating];
  const RatingIcon = rating.icon;

  return (
    <div className="glass-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Fish className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Previsão de Pesca</h2>
          <p className="text-xs text-muted-foreground">Condições para pescar</p>
        </div>
      </div>

      {/* Rating display */}
      <div className={`mb-5 flex items-center justify-between rounded-xl ${rating.bgColor} p-4`}>
        <div className="flex items-center gap-3">
          <RatingIcon className={`h-8 w-8 ${rating.color}`} />
          <div>
            <p className={`text-2xl font-bold ${rating.color}`}>{rating.label}</p>
            <p className="text-sm text-muted-foreground">Condição geral</p>
          </div>
        </div>
      </div>

      {/* Sun & Moon Info */}
      <div className="mb-4 rounded-xl bg-gradient-to-br from-sun/10 to-primary/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sun className="h-4 w-4 text-sun" />
          <p className="text-sm font-semibold">Sol e Lua</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-sun" />
            <div>
              <p className="text-xs text-muted-foreground">Nascer do Sol</p>
              <p className="text-sm font-semibold">{forecast.sunMoon.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sunset className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pôr do Sol</p>
              <p className="text-sm font-semibold">{forecast.sunMoon.sunset}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Nascer da Lua</p>
              <p className="text-sm font-semibold">{forecast.sunMoon.moonrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Pôr da Lua</p>
              <p className="text-sm font-semibold">{forecast.sunMoon.moonset}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Duração do dia</span>
          <span className="text-sm font-semibold text-sun">{forecast.sunMoon.dayLength}</span>
        </div>
      </div>

      {/* Details grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Moon className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Fase da Lua</p>
            <p className="text-sm font-semibold">{forecast.moonPhase}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
          <Waves className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Influência da Maré</p>
            <p className="text-sm font-semibold">{forecast.tideInfluence}</p>
          </div>
        </div>
      </div>

      {/* Best times */}
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Melhores Horários</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {forecast.bestTimes.map((time, index) => (
            <span
              key={index}
              className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <p className="text-xs font-semibold text-primary mb-3">💡 Dicas do Dia</p>
        <div className="space-y-2">
          {forecast.tips.map((tip, index) => (
            <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
