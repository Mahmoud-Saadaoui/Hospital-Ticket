import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getPatientAppointments,
} from "../api/appointmentsApi";

export const usePatientAppointments = (patientId) =>
  useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => getPatientAppointments(patientId),
    enabled: Boolean(patientId),
  });

export const useAllAppointments = () =>
  useQuery({
    queryKey: ["appointments", "all"],
    queryFn: getAllAppointments,
  });

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
