import { useQuery } from "@tanstack/react-query";
import {
  getDoctorPatients,
  getDoctors,
  getDoctorsBySpecialty,
  getSpecialties,
} from "../api/doctorsApi";

export const useSpecialties = () =>
  useQuery({
    queryKey: ["doctors", "specialties"],
    queryFn: getSpecialties,
  });

export const useDoctorsBySpecialty = (specialty) =>
  useQuery({
    queryKey: ["doctors", "by-specialty", specialty],
    queryFn: () => getDoctorsBySpecialty(specialty),
    enabled: Boolean(specialty),
  });

export const useDoctors = () =>
  useQuery({
    queryKey: ["doctors", "all"],
    queryFn: getDoctors,
  });

export const useDoctorPatients = (doctorId) =>
  useQuery({
    queryKey: ["doctors", doctorId, "patients"],
    queryFn: () => getDoctorPatients(doctorId),
    enabled: Boolean(doctorId),
  });
