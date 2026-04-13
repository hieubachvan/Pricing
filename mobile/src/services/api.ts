import axios from 'axios';
import { Platform } from 'react-native';

// Use the Local Wi-Fi IP to bypass the broken tunnels
const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://172.16.5.55:3000';
const API_URL = `${baseUrl}/api`;

export const getLatestPrices = async (): Promise<any[]> => {
   const res = await axios.get(`${API_URL}/prices/latest`);
   return res.data;
};

export const getPriceHistory = async (symbol: string): Promise<any[]> => {
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
