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
