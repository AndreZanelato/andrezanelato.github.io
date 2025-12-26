import { Fish, Moon, Waves, Clock, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface FishForecastData {
  overallRating: "excellent" | "good" | "moderate" | "poor";
  bestTimes: string[];
  moonPhase: string;
  tideInfluence: string;
  recommendedSpecies: string[];
  tips: string;
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

      {/* Recommended species */}
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Fish className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Espécies Recomendadas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {forecast.recommendedSpecies.map((species, index) => (
            <span
              key={index}
              className="rounded-full bg-accent/50 px-3 py-1 text-xs font-medium"
            >
              {species}
            </span>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <p className="text-xs font-semibold text-primary">💡 Dica do Dia</p>
        <p className="mt-1 text-sm text-muted-foreground">{forecast.tips}</p>
      </div>
    </div>
  );
}
