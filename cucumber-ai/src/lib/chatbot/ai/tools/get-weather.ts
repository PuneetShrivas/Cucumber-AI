import { tool } from 'ai';
import { z } from 'zod';

export const getWeather = tool({
  description: 'Get the current weather at a location',
  inputSchema: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});

export const getLatLongFromCity = tool({
  description: 'Get the latitude and longitude of a city',
  inputSchema: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    const response = await fetch(
      // format https://geocoding-api.open-meteo.com/v1/search?name=bhopal&count=1&language=en&format=json
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
    );

    const locationData = await response.json();
    return locationData;
  },
});