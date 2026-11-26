import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  uploadUserImage,
} from "../api/usersApi";

export const useUsers = () =>
  useQuery({
    queryKey: ["users", "all"],
    queryFn: getUsers,
  });

export const useUser = (userId) =>
  useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUploadUserImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
