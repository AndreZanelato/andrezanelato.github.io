export interface TideData {
  time: string;
  height: number;
  type: "high" | "low";
}

export interface WeatherData {
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

export interface SunMoonData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  dayLength: string;
}

export interface FishForecastData {
  overallRating: "excellent" | "good" | "moderate" | "poor";
  bestTimes: string[];
  moonPhase: string;
  tideInfluence: string;
  tips: string[];
  sunMoon: SunMoonData;
}

export interface WindData {
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

// Generate mock tide data based on date
export function generateTideData(date: Date): TideData[] {
  const dayOfMonth = date.getDate();
  const baseHour = (dayOfMonth % 12) + 1;
  
  return [
    { time: `${String(baseHour).padStart(2, '0')}:${String((dayOfMonth * 7) % 60).padStart(2, '0')}`, height: 1.2 + (dayOfMonth % 5) * 0.1, type: "high" },
    { time: `${String((baseHour + 6) % 24).padStart(2, '0')}:${String((dayOfMonth * 3) % 60).padStart(2, '0')}`, height: 0.3 + (dayOfMonth % 3) * 0.1, type: "low" },
    { time: `${String((baseHour + 12) % 24).padStart(2, '0')}:${String((dayOfMonth * 11) % 60).padStart(2, '0')}`, height: 1.4 + (dayOfMonth % 4) * 0.1, type: "high" },
    { time: `${String((baseHour + 18) % 24).padStart(2, '0')}:${String((dayOfMonth * 5) % 60).padStart(2, '0')}`, height: 0.2 + (dayOfMonth % 4) * 0.1, type: "low" },
  ];
}

// Generate mock weather data based on date and location
export function generateWeatherData(date: Date, location: string): WeatherData {
  const dayOfMonth = date.getDate();
  const conditions: WeatherData["condition"][] = ["sunny", "cloudy", "rainy", "partly-cloudy"];
  const conditionIndex = (dayOfMonth + location.length) % 4;
  
  const baseTemp = 22 + (dayOfMonth % 10);
  const humidity = 50 + (dayOfMonth % 40);
  
  // Generate sun times based on date
  const sunriseHour = 5 + (dayOfMonth % 2);
  const sunsetHour = 17 + (dayOfMonth % 3);
  
  return {
    condition: conditions[conditionIndex],
    temperature: baseTemp,
    feelsLike: baseTemp + (humidity > 70 ? 3 : -1),
    humidity,
    pressure: 1010 + (dayOfMonth % 20),
    windSpeed: 10 + (dayOfMonth % 20),
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][dayOfMonth % 8],
    visibility: 8 + (dayOfMonth % 12),
    uvIndex: Math.min(11, 3 + (dayOfMonth % 8)),
    sunrise: `${String(sunriseHour).padStart(2, '0')}:${String((dayOfMonth * 2) % 60).padStart(2, '0')}`,
    sunset: `${String(sunsetHour).padStart(2, '0')}:${String((dayOfMonth * 3) % 60).padStart(2, '0')}`,
    dayLength: `${sunsetHour - sunriseHour}h ${Math.abs(((dayOfMonth * 3) % 60) - ((dayOfMonth * 2) % 60))}min`,
  };
}

// Seasonal fish species for Brazilian coast
const seasonalSpecies: Record<number, string[]> = {
  // Janeiro - Verão
  0: ["Robalo", "Corvina", "Tainha", "Anchova", "Xaréu", "Olho-de-Boi"],
  // Fevereiro - Verão
  1: ["Robalo", "Corvina", "Tainha", "Anchova", "Xaréu", "Dourado"],
  // Março - Outono
  2: ["Corvina", "Pescada", "Tainha", "Anchova", "Sargo", "Betara"],
  // Abril - Outono
  3: ["Corvina", "Pescada", "Tainha", "Parati", "Sargo", "Betara"],
  // Maio - Outono
  4: ["Pescada", "Tainha", "Parati", "Corvina", "Bagre", "Linguado"],
  // Junho - Inverno
  5: ["Tainha", "Pescada", "Corvina", "Parati", "Bagre", "Linguado"],
  // Julho - Inverno (pico da tainha)
  6: ["Tainha", "Corvina", "Pescada", "Bagre", "Linguado", "Pampo"],
  // Agosto - Inverno
  7: ["Tainha", "Corvina", "Pescada", "Pampo", "Linguado", "Betara"],
  // Setembro - Primavera
  8: ["Corvina", "Robalo", "Pescada", "Pampo", "Anchova", "Carapeba"],
  // Outubro - Primavera
  9: ["Robalo", "Corvina", "Anchova", "Pescada", "Pampo", "Carapeba"],
  // Novembro - Primavera
  10: ["Robalo", "Anchova", "Corvina", "Xaréu", "Pampo", "Olho-de-Boi"],
  // Dezembro - Verão
  11: ["Robalo", "Anchova", "Corvina", "Xaréu", "Dourado", "Olho-de-Boi"],
};

// Generate mock fish forecast data
export function generateFishForecastData(date: Date, location: string): FishForecastData {
  const dayOfMonth = date.getDate();
  const ratings: FishForecastData["overallRating"][] = ["excellent", "good", "moderate", "poor"];
  const ratingIndex = (dayOfMonth + location.length) % 4;
  
  const moonPhases = ["Lua Nova", "Lua Crescente", "Lua Cheia", "Lua Minguante"];
  const tideInfluences = ["Favorável", "Muito Favorável", "Neutro", "Desfavorável"];
  
  const allTips = [
    "Aposte em iscas naturais durante a maré enchendo para melhores resultados.",
    "O vento leste favorece a aproximação de cardumes na costa.",
    "Pesque próximo às pedras durante a maré baixa.",
    "Iscas artificiais funcionam melhor nas primeiras horas da manhã.",
    "A lua cheia aumenta a atividade dos peixes durante a noite.",
    "Prefira linhas mais finas em águas claras para não assustar os peixes.",
    "Observe as aves marinhas - onde elas mergulham há cardumes.",
    "O amanhecer e o entardecer são os melhores horários para pescar.",
    "Marés de sizígia (lua nova/cheia) costumam trazer mais peixes.",
    "Use iscas vivas para atrair peixes maiores e mais arredios.",
    "Verifique a temperatura da água - peixes preferem águas entre 20-26°C.",
    "Pescar após chuvas leves pode ser produtivo por causa da água movimentada.",
  ];

  const baseHour = (dayOfMonth % 6) + 5;
  
  // Select 3-4 tips based on the day
  const tipStartIndex = dayOfMonth % allTips.length;
  const selectedTips = [
    allTips[tipStartIndex],
    allTips[(tipStartIndex + 3) % allTips.length],
    allTips[(tipStartIndex + 7) % allTips.length],
  ];
  
  // Generate sun/moon times based on date
  const sunriseHour = 5 + (dayOfMonth % 2);
  const sunsetHour = 17 + (dayOfMonth % 3);
  const moonriseHour = (dayOfMonth + 6) % 24;
  const moonsetHour = (moonriseHour + 12) % 24;
  
  const sunMoon: SunMoonData = {
    sunrise: `${String(sunriseHour).padStart(2, '0')}:${String((dayOfMonth * 2) % 60).padStart(2, '0')}`,
    sunset: `${String(sunsetHour).padStart(2, '0')}:${String((dayOfMonth * 3) % 60).padStart(2, '0')}`,
    moonrise: `${String(moonriseHour).padStart(2, '0')}:${String((dayOfMonth * 5) % 60).padStart(2, '0')}`,
    moonset: `${String(moonsetHour).padStart(2, '0')}:${String((dayOfMonth * 4) % 60).padStart(2, '0')}`,
    dayLength: `${sunsetHour - sunriseHour}h ${Math.abs(((dayOfMonth * 3) % 60) - ((dayOfMonth * 2) % 60))}min`,
  };
  
  return {
    overallRating: ratings[ratingIndex],
    bestTimes: [
      `${String(baseHour).padStart(2, '0')}:00 - ${String(baseHour + 2).padStart(2, '0')}:00`,
      `${String((baseHour + 12) % 24).padStart(2, '0')}:00 - ${String((baseHour + 14) % 24).padStart(2, '0')}:00`,
    ],
    moonPhase: moonPhases[dayOfMonth % 4],
    tideInfluence: tideInfluences[(dayOfMonth + 1) % 4],
    tips: selectedTips,
    sunMoon,
  };
}

// Generate mock wind data
export function generateWindData(date: Date): WindData {
  const dayOfMonth = date.getDate();
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const directionIndex = dayOfMonth % 8;
  
  const speed = 8 + (dayOfMonth % 25);
  const gustSpeed = speed + 5 + (dayOfMonth % 10);
  
  const beaufortDescriptions = [
    "Calmaria", "Aragem", "Brisa leve", "Brisa fraca", "Brisa moderada",
    "Brisa forte", "Vento fresco", "Vento forte", "Ventania", "Ventania forte"
  ];
  
  const beaufortScale = Math.min(9, Math.floor(speed / 5));

  const hourlyForecast = [];
  for (let i = 0; i < 6; i++) {
    const hour = (new Date().getHours() + i) % 24;
    hourlyForecast.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      speed: speed + ((dayOfMonth + i) % 10) - 5,
      direction: directions[(directionIndex + Math.floor(i / 2)) % 8],
    });
  }

  return {
    speed,
    gustSpeed,
    direction: directions[directionIndex],
    directionDegrees: directionIndex * 45,
    beaufortScale,
    beaufortDescription: beaufortDescriptions[beaufortScale],
    hourlyForecast,
  };
}
