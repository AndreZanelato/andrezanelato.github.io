import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const popularLocations = [
  "Santos, SP",
  "Rio de Janeiro, RJ",
  "Florianópolis, SC",
  "Recife, PE",
  "Salvador, BA",
];

export function LocationSearch({ location, onLocationChange }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(location);

  const handleSelect = (loc: string) => {
    setSearchValue(loc);
    onLocationChange(loc);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onLocationChange(searchValue);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="glass-card rounded-xl p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground">Localização</p>
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Buscar cidade ou praia..."
              className="mt-1 border-none bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSearch}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-card shadow-card animate-fade-in">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              Locais populares
            </p>
            {popularLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{loc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
