import axios from "axios";

let accessToken = null;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const isAuthRequest = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/register") ||
  url.includes("/auth/refresh") ||
  url.includes("/auth/logout");

const notifySessionExpired = () => {
  clearAccessToken();
  window.dispatchEvent(new Event("auth:session-expired"));
};

axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url) ||
      originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshClient
        .get("/auth/refresh")
        .then((response) => {
          const nextToken = response.data?.data?.accessToken;

          if (!nextToken) {
            throw new Error("Refresh token response is invalid");
          }

          setAccessToken(nextToken);
          return nextToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const nextToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      notifySessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
