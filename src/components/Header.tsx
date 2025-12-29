import { Waves } from "lucide-react";

export function Header() {
  return (
    <header className="ocean-gradient px-4 pb-8 pt-12 text-primary-foreground">
      <div className="container mx-auto max-w-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Waves className="h-6 w-6 animate-wave" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-shadow">Maré de Bolso</h1>
            <p className="text-sm opacity-90">Tábua de marés e previsão do tempo</p>
          </div>
        </div>
      </div>
    </header>
  );
}
