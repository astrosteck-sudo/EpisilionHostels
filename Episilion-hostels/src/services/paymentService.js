import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

//console.log('API', API)

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      token;
  }
  console.log('CONFIG', config)

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
  console.log(response.data)

  return response.data;
};