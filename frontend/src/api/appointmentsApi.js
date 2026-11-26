import axiosInstance from "./axiosInstance";

export const createAppointment = async ({ doctorId, appointmentDate }) => {
  const response = await axiosInstance.post("/appointment/new", {
    doctorId,
    appointmentDate,
  });

  return response.data;
};

export const getAllAppointments = async () => {
  const response = await axiosInstance.get("/appointment/");
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await axiosInstance.get(`/appointment/${patientId}`);
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await axiosInstance.delete(
    `/appointment/${appointmentId}`
  );

  return response.data;
};
