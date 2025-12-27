export interface Location {
  name: string;
  lat: number;
  lon: number;
}

export const popularLocations: Location[] = [
  { name: "Santos, SP", lat: -23.9608, lon: -46.3336 },
  { name: "Guarujá, SP", lat: -23.9930, lon: -46.2564 },
  { name: "Ubatuba, SP", lat: -23.4336, lon: -45.0838 },
  { name: "Florianópolis, SC", lat: -27.5954, lon: -48.5480 },
  { name: "Criciúma, SC", lat: -28.6775, lon: -49.3697 },
  { name: "Balneário Camboriú, SC", lat: -26.9906, lon: -48.6352 },
  { name: "Itajaí, SC", lat: -26.9078, lon: -48.6619 },
  { name: "Rio de Janeiro, RJ", lat: -22.9068, lon: -43.1729 },
  { name: "Búzios, RJ", lat: -22.7469, lon: -41.8817 },
  { name: "Arraial do Cabo, RJ", lat: -22.9661, lon: -42.0278 },
  { name: "Porto de Galinhas, PE", lat: -8.5064, lon: -35.0053 },
  { name: "Salvador, BA", lat: -12.9714, lon: -38.5014 },
  { name: "Maceió, AL", lat: -9.6498, lon: -35.7089 },
  { name: "Natal, RN", lat: -5.7945, lon: -35.2110 },
  { name: "Fortaleza, CE", lat: -3.7172, lon: -38.5433 },
  { name: "Ilhabela, SP", lat: -23.7786, lon: -45.3581 },
  { name: "Paraty, RJ", lat: -23.2178, lon: -44.7131 },
  { name: "Angra dos Reis, RJ", lat: -23.0067, lon: -44.3181 },
];

export function findLocation(name: string): Location | undefined {
  return popularLocations.find(
    loc => loc.name.toLowerCase() === name.toLowerCase()
  );
}

export function getDefaultLocation(): Location {
  return popularLocations[0];
}
