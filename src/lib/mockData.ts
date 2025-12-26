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
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
}

export interface FishForecastData {
  overallRating: "excellent" | "good" | "moderate" | "poor";
  bestTimes: string[];
  moonPhase: string;
  tideInfluence: string;
  recommendedSpecies: string[];
  tips: string;
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
  
  return {
    condition: conditions[conditionIndex],
    temperature: baseTemp,
    feelsLike: baseTemp + (humidity > 70 ? 3 : -1),
    humidity,
    windSpeed: 10 + (dayOfMonth % 20),
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][dayOfMonth % 8],
    visibility: 8 + (dayOfMonth % 12),
    uvIndex: Math.min(11, 3 + (dayOfMonth % 8)),
  };
}

// Generate mock fish forecast data
export function generateFishForecastData(date: Date, location: string): FishForecastData {
  const dayOfMonth = date.getDate();
  const ratings: FishForecastData["overallRating"][] = ["excellent", "good", "moderate", "poor"];
  const ratingIndex = (dayOfMonth + location.length) % 4;
  
  const moonPhases = ["Lua Nova", "Lua Crescente", "Lua Cheia", "Lua Minguante"];
  const tideInfluences = ["Favorável", "Muito Favorável", "Neutro", "Desfavorável"];
  
  const allSpecies = [
    "Robalo", "Corvina", "Pescada", "Tainha", "Anchova", 
    "Sargo", "Garoupa", "Badejo", "Linguado", "Pampo"
  ];
  
  const tips = [
    "Aposte em iscas naturais durante a maré enchendo para melhores resultados.",
    "O vento leste favorece a aproximação de cardumes na costa.",
    "Pesque próximo às pedras durante a maré baixa.",
    "Iscas artificiais funcionam melhor nas primeiras horas da manhã.",
    "A lua cheia aumenta a atividade dos peixes durante a noite.",
  ];

  const baseHour = (dayOfMonth % 6) + 5;
  
  return {
    overallRating: ratings[ratingIndex],
    bestTimes: [
      `${String(baseHour).padStart(2, '0')}:00 - ${String(baseHour + 2).padStart(2, '0')}:00`,
      `${String((baseHour + 12) % 24).padStart(2, '0')}:00 - ${String((baseHour + 14) % 24).padStart(2, '0')}:00`,
    ],
    moonPhase: moonPhases[dayOfMonth % 4],
    tideInfluence: tideInfluences[(dayOfMonth + 1) % 4],
    recommendedSpecies: allSpecies.slice((dayOfMonth % 5), (dayOfMonth % 5) + 4),
    tips: tips[dayOfMonth % 5],
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
