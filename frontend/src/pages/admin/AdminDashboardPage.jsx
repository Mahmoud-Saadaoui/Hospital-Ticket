import { Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useAllAppointments } from "../../hooks/useAppointments";
import { useDoctors } from "../../hooks/useDoctors";
import { useUsers } from "../../hooks/useUsers";
import getApiError from "../../utils/apiError";

const getCount = (response, key) => response?.data?.[key]?.length ?? 0;

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const doctorsQuery = useDoctors();
  const usersQuery = useUsers();
  const appointmentsQuery = useAllAppointments();
  const queries = [doctorsQuery, usersQuery, appointmentsQuery];
  const isLoading = queries.some((query) => query.isLoading);
  const firstError = queries.find((query) => query.isError);

  const cards = [
    { label: t("admin.doctors"), count: getCount(doctorsQuery.data, "doctors") },
    { label: t("admin.users"), count: getCount(usersQuery.data, "user") },
    {
      label: t("admin.appointments"),
      count: getCount(appointmentsQuery.data, "appointments"),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Flex className="admin-dashboard__header" direction="column" gap="2">
        <Heading size={{ initial: "7", sm: "8" }} as="h2">
          {t("admin.dashboard")}
        </Heading>
        <Text color="gray">{t("admin.subtitle")}</Text>
      </Flex>

      {isLoading && (
        <div className="admin-state" role="status" aria-live="polite">
          <Text>{t("common.loading")}</Text>
        </div>
      )}

      {firstError && (
        <div className="admin-state admin-state--error" role="alert">
          <Text color="red">
            {getApiError(firstError.error, t("errors.generic")).message}
          </Text>
        </div>
      )}

      {!isLoading && !firstError && (
        <div className="admin-metrics">
          {cards.map((card) => (
            <div className="admin-metric" key={card.label}>
              <Flex direction="column" gap="2">
                <Text color="gray">{card.label}</Text>
                <Text size="8" weight="bold">
                  {card.count}
                </Text>
              </Flex>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
