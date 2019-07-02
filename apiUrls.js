import apiKeys from './apiKeys';

export const googleImgApi = 'https://www.googleapis.com/customsearch/v1';
export const BASE_URL = `http://api.openweathermap.org/data/2.5/weather?mode=json&APPID=${ apiKeys.openWeather}`;
export const FORECAST_URL = `http://api.openweathermap.org/data/2.5/forecast?mode=json&APPID=${ apiKeys.openWeather}`;
