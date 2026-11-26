import axiosInstance, { clearAccessToken } from "./axiosInstance";

export const register = async ({ name, email, phone, password }) => {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    phone,
    password,
  });

  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const refresh = async () => {
  const response = await axiosInstance.get("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");

    return {
      status: response.status,
      data: response.data,
      succeeded:
        response.status === 204 ||
        (response.status === 200 &&
          response.data?.data?.title === "Logout success"),
    };
  } finally {
    clearAccessToken();
  }
};
