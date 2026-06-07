import axios from "axios";

const API = axios.create({
  baseURL: "https://episilion-backend-2lt0.onrender.com/api",
});

//console.log('API', API)

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      token;
  }
  return config;
});

export const initializePayment = async (
  planId
) => {
  const response = await API.post(
    "/payments/initialize",
    {
      planId,
    }
  );

  return response.data;
};