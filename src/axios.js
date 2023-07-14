import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

//при кожному запиті перевіряється, чи є інфа про користувача у браузері
instance.interceptors.request.use((config) => {
  config.headers.authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;