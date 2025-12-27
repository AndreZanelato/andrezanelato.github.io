import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { popularLocations, type Location } from "@/lib/locations";

interface LocationSearchProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSearch({ location, onLocationChange }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(location.name);

  const handleSelect = (loc: Location) => {
    setSearchValue(loc.name);
    onLocationChange(loc);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Find matching location or use first one as fallback
      const found = popularLocations.find(
        loc => loc.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (found) {
        onLocationChange(found);
      }
      setIsOpen(false);
    }
  };

  const filteredLocations = searchValue.trim()
    ? popularLocations.filter(loc =>
        loc.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : popularLocations.slice(0, 8);

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
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto overflow-hidden rounded-xl border bg-card shadow-card animate-fade-in">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              {searchValue.trim() ? "Resultados" : "Locais populares"}
            </p>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleSelect(loc)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{loc.name}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum local encontrado
              </p>
            )}
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
