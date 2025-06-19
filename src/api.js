import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/docs#/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // если нужны куки для авторизации
});

export default api;
