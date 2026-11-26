import axiosInstance from "./axiosInstance";

export const getUsers = async () => {
  const response = await axiosInstance.get("/users/");
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, payload) => {
  const response = await axiosInstance.put(`/users/${userId}`, {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
  });

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};

export const uploadUserImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(
    "/users/upload-user-image",
    formData
  );

  return response.data;
};
