import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserTable from "../../components/users/UserTable";
import { useDeleteUser, useUser, useUsers } from "../../hooks/useUsers";
import getApiError, { getApiErrorStatus } from "../../utils/apiError";

const AdminUsersPage = () => {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState("");
  const usersQuery = useUsers();
  const userQuery = useUser(selectedUserId);
  const deleteMutation = useDeleteUser();
  const users = usersQuery.data?.data?.user ?? [];
  const usersStatus = getApiErrorStatus(usersQuery.error);
  const isEmptyResponse = usersStatus === 404 || usersStatus === 400;
  const error = usersQuery.error || userQuery.error || deleteMutation.error;
  const errorMessage = error
    ? getApiError(error, t("errors.generic")).message
    : "";

  const handleDelete = async (userId) => {
    if (!window.confirm(t("admin.deleteUserConfirm"))) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(userId);
      if (selectedUserId === userId) {
        setSelectedUserId("");
      }
    } catch {
      // The mutation error is rendered in the page.
    }
  };

  return (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="2">
        <Heading size={{ initial: "7", sm: "8" }} as="h2">
          {t("admin.users")}
        </Heading>
        <Text color="gray">{t("admin.userSubtitle")}</Text>
      </Flex>

      {usersQuery.isLoading && (
        <Text role="status" aria-live="polite">
          {t("common.loading")}
        </Text>
      )}

      {error && !isEmptyResponse && (
        <Card role="alert" className="admin-state admin-state--error">
          <Text color="red">{errorMessage}</Text>
        </Card>
      )}

      {!usersQuery.isLoading && (users.length > 0 || isEmptyResponse) && (
        <Card className="admin-list-section">
          <UserTable
            users={users}
            selectedUserId={selectedUserId}
            onSelect={setSelectedUserId}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </Card>
      )}

      {userQuery.data?.data?.user && (
        <Card className="admin-list-section">
          <Flex direction="column" gap="2">
            <Heading size="5" as="h3">
              {t("common.details")}
            </Heading>
            <Text>{userQuery.data.data.user.name}</Text>
            <Text>{userQuery.data.data.user.email}</Text>
            <Text>{userQuery.data.data.user.phone}</Text>
            <Text>
              {userQuery.data.data.user.isAdmin
                ? t("header.admin")
                : t("profile.patient")}
            </Text>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export default AdminUsersPage;
