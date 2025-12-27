import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { popularLocations, type Location } from "@/lib/locations";

interface LocationSearchProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSearch({ location, onLocationChange }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(location.name);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!searchValue.trim() || searchValue.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        // First check local popular locations
        const localResults = popularLocations.filter(loc =>
          loc.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        if (localResults.length >= 3) {
          setSearchResults(localResults.slice(0, 8));
          setIsSearching(false);
          return;
        }

        // Search via IBGE API
        const { data, error } = await supabase.functions.invoke('search-municipalities', {
          body: { query: searchValue, limit: 8 },
        });

        if (error) {
          console.error('Search error:', error);
          setSearchError('Erro ao buscar municípios');
          setSearchResults(localResults);
        } else if (data?.municipalities) {
          // Merge local and API results, removing duplicates
          const apiResults = data.municipalities as Location[];
          const merged = [...localResults];
          
          apiResults.forEach(apiLoc => {
            if (!merged.some(m => m.name === apiLoc.name)) {
              merged.push(apiLoc);
            }
          });

          setSearchResults(merged.slice(0, 8));
        } else {
          setSearchResults(localResults);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Erro de conexão');
        // Fallback to local search
        setSearchResults(
          popularLocations.filter(loc =>
            loc.name.toLowerCase().includes(searchValue.toLowerCase())
          ).slice(0, 8)
        );
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSelect = (loc: Location) => {
    setSearchValue(loc.name);
    onLocationChange(loc);
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (searchResults.length > 0) {
      handleSelect(searchResults[0]);
    }
  };

  const displayLocations = searchValue.trim().length >= 2 
    ? searchResults 
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
              placeholder="Buscar cidade..."
              className="mt-1 border-none bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSearch}
            disabled={isSearching}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto overflow-hidden rounded-xl border bg-card shadow-card animate-fade-in">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando municípios...
                </span>
              ) : searchValue.trim().length >= 2 ? (
                searchError ? searchError : "Resultados"
              ) : (
                "Locais populares"
              )}
            </p>
            {displayLocations.length > 0 ? (
              displayLocations.map((loc, index) => (
                <button
                  key={`${loc.name}-${index}`}
                  onClick={() => handleSelect(loc)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{loc.name}</span>
                </button>
              ))
            ) : !isSearching && searchValue.trim().length >= 2 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum município encontrado
              </p>
            ) : null}
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
