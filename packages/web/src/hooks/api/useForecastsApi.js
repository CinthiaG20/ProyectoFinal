import * as ForecastsApi from '../../api/endpoints/forecasts.js';

export function useForecastsApi() {
  return {
    createOrUpdateForecast: ForecastsApi.apiCreateOrUpdateForecast,
    getMyForecast: ForecastsApi.apiGetMyForecast,
    listForecasts: ForecastsApi.apiListForecasts,
    getLeaderboard: ForecastsApi.apiGetLeaderboard,
    deleteForecast: ForecastsApi.apiDeleteForecast,
  };
}
