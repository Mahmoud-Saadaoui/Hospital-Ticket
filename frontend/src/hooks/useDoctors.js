import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createDoctor,
  deleteDoctor,
    getDoctorPatients,
    getDoctors,
    getDoctorsBySpecialty,
    getSpecialties,
    uploadDoctorImage,
  updateDoctor,
} from "../api/doctorsApi";

export const useSpecialties = () =>
  useQuery({
    queryKey: ["doctors", "specialties"],
    queryFn: getSpecialties,
  });

export const useDoctorsBySpecialty = (specialty, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["doctors", "by-specialty", specialty, { page, limit }],
    queryFn: () => getDoctorsBySpecialty(specialty, { page, limit }),
    enabled: Boolean(specialty),
    placeholderData: keepPreviousData,
  });

export const useDoctors = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["doctors", "all", { page, limit }],
    queryFn: () => getDoctors({ page, limit }),
    placeholderData: keepPreviousData,
  });

export const useDoctorPatients = (doctorId) =>
  useQuery({
    queryKey: ["doctors", doctorId, "patients"],
    queryFn: () => getDoctorPatients(doctorId),
    enabled: Boolean(doctorId),
  });

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "all"] });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, payload }) => updateDoctor(doctorId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "all"] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "all"] });
    },
  });
};

export const useUploadDoctorImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, file }) => uploadDoctorImage(doctorId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors", "all"] });
    },
  });
};
