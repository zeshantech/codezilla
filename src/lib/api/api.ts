import { IError } from "@/types";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IError>) => {
    if (error.response?.data.errors.length) {
      return Promise.reject(error.response?.data.errors[0]);
    }

    return Promise.reject(error.response?.data.message);
  }
);

export default api;
