import axios from "axios";

let bearerToken = "";

const API = axios.create();

export const setAxiosConfig = (token: string) => {
  bearerToken = token;
};

API.interceptors.request.use((axiosConfig) => {
  axiosConfig.baseURL = import.meta.env.VITE_BASE_URL;
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;

  return axiosConfig;
});

export default API;
