import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = 'https://odd-carpets-occur.loca.lt/api';
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

export const getLatestPrices = async () => {
   const res = await axios.get(`${API_URL}/prices/latest`);
   return res.data;
};

export const getPriceHistory = async (symbol: string) => {
   const res = await axios.get(`${API_URL}/prices/history/${encodeURIComponent(symbol)}`);
   return res.data;
};

export const createAlert = async (token: string, symbol: string, condition: string, targetField: string, threshold: string) => {
   const res = await axios.post(`${API_URL}/alerts`, {
      expoToken: token,
      symbol,
      condition,
      targetField,
      threshold
   });
   return res.data;
}
