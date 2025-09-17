import axios from 'axios';

const VITE_URL_BACK = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: VITE_URL_BACK,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});