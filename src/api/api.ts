import axios from "axios";

export const originUrl = process.env.SERVER;

export const axiosInstance = axios.create({
  baseURL: originUrl,
  timeout: 10000,
});
