import axiosInstance from "./axiosInstance";

export const getSpecialties = async () => {
  const response = await axiosInstance.get("/doctor/getSpecialties");
  return response.data;
};

export const getDoctorsBySpecialty = async (specialty) => {
  const response = await axiosInstance.get(
    `/doctor/specialty/${encodeURIComponent(specialty)}`
  );
  return response.data;
};

export const createDoctor = async (payload) => {
  const response = await axiosInstance.post("/doctor/new", {
    fullName: payload.fullName,
    specialty: payload.specialty,
    email: payload.email,
    phone: payload.phone,
    bio: payload.bio,
  });

  return response.data;
};

export const getDoctors = async () => {
  const response = await axiosInstance.get("/doctor/doctors");
  return response.data;
};

export const getDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/doctor/doctors/${doctorId}`);
  return response.data;
};

export const getDoctorPatients = async (doctorId) => {
  const response = await axiosInstance.get(
    `/doctor/doctors/${doctorId}/patients`
  );
  return response.data;
};

export const updateDoctor = async (doctorId, payload) => {
  const response = await axiosInstance.put(`/doctor/doctors/${doctorId}`, {
    fullName: payload.fullName,
    specialty: payload.specialty,
    email: payload.email,
    phone: payload.phone,
    bio: payload.bio,
  });

  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await axiosInstance.delete(`/doctor/doctors/${doctorId}`);
  return response.data;
};

export const uploadDoctorImage = async (doctorId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post(
    `/doctor/upload-doctor-image/${doctorId}`,
    formData
  );

  return response.data;
};
