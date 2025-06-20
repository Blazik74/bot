import axios from "axios";

const API_URL = "https://back-guqa.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // если нужны куки для авторизации
});

export default api;
