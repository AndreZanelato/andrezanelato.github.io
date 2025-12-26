import { Waves, TrendingUp, TrendingDown } from "lucide-react";

interface TideData {
  time: string;
  height: number;
  type: "high" | "low";
}

interface TideTableProps {
  tides: TideData[];
}

export function TideTable({ tides }: TideTableProps) {
  return (
    <div className="glass-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tide-high/20">
          <Waves className="h-5 w-5 text-tide-high" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Tábua de Marés</h2>
          <p className="text-xs text-muted-foreground">Horários de maré alta e baixa</p>
        </div>
      </div>

      <div className="space-y-3">
        {tides.map((tide, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-xl p-4 transition-all ${
              tide.type === "high"
                ? "bg-tide-high/10 border border-tide-high/20"
                : "bg-tide-low/10 border border-tide-low/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  tide.type === "high" ? "bg-tide-high/20" : "bg-tide-low/20"
                }`}
              >
                {tide.type === "high" ? (
                  <TrendingUp className="h-5 w-5 text-tide-high" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-tide-low" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {tide.type === "high" ? "Maré Alta" : "Maré Baixa"}
                </p>
                <p className="text-xs text-muted-foreground">{tide.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{tide.height.toFixed(1)}m</p>
              <p className="text-xs text-muted-foreground">altura</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-tide-high" />
          <span>Maré Alta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-tide-low" />
          <span>Maré Baixa</span>
        </div>
      </div>
    </div>
  );
}
