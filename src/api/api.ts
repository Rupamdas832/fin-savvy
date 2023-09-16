import axios from "axios";

export const originUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const axiosInstance = axios.create({
  baseURL: originUrl,
  timeout: 10000,
  withCredentials: true,
});
