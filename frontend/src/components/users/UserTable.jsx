import { Button, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const UserTable = ({ users, selectedUserId, onSelect, onDelete, isDeleting }) => {
  const { t } = useTranslation();

  return (
    <div className="doctor-table-wrapper">
      <table className="doctor-table">
        <thead>
          <tr>
            <th>{t("profile.name")}</th>
            <th>{t("profile.email")}</th>
            <th>{t("profile.phone")}</th>
            <th>{t("profile.role")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td data-label={t("profile.name")}>{user.name}</td>
              <td data-label={t("profile.email")}>{user.email}</td>
              <td data-label={t("profile.phone")}>{user.phone}</td>
              <td data-label={t("profile.role")}>
                {user.isAdmin ? t("header.admin") : t("profile.patient")}
              </td>
              <td data-label={t("common.actions")}>
                <div className="doctor-table__actions">
                  <Button
                    type="button"
                    size="1"
                    variant={selectedUserId === user._id ? "solid" : "soft"}
                    onClick={() => onSelect(user._id)}
                  >
                    {t("common.details")}
                  </Button>
                  <Button
                    type="button"
                    size="1"
                    color="red"
                    variant="soft"
                    onClick={() => onDelete(user._id)}
                    disabled={isDeleting}
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <Text color="gray">{t("common.empty")}</Text>}
    </div>
  );
};

export default UserTable;
