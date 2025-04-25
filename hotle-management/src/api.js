import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-qlks-production.up.railway.app", // đúng PORT backend của bạn
});

export default api;


// Thêm token vào header nếu có
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


