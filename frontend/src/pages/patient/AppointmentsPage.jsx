import { Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import useAuth from "../../hooks/useAuth";
import { usePatientAppointments } from "../../hooks/useAppointments";
import { getApiErrorMessage, getApiErrorStatus } from "../../utils/apiError";

const AppointmentsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const appointmentsQuery = usePatientAppointments(user?.id);
  const appointments = appointmentsQuery.data?.data?.appointments ?? [];
  const isEmptyResponse =
    getApiErrorStatus(appointmentsQuery.error) === 404;
  const errorMessage = appointmentsQuery.error
    ? getApiErrorMessage(appointmentsQuery.error, t("errors.generic"), t)
    : "";

  return (
    <Container size="4" py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="6">
        <Heading size={{ initial: "7", sm: "8" }} as="h1">
          {t("patient.myAppointments")}
        </Heading>

        {appointmentsQuery.isLoading && (
          <Text role="status" aria-live="polite">
            {t("common.loading")}
          </Text>
        )}

        {appointmentsQuery.isError && !isEmptyResponse && (
          <Card role="alert">
            <Text color="red">{errorMessage}</Text>
          </Card>
        )}

        {!appointmentsQuery.isLoading &&
          (!appointmentsQuery.isError || isEmptyResponse) &&
          appointments.length === 0 && (
            <Text color="gray">{t("appointment.noAppointments")}</Text>
          )}

        {appointments.length > 0 && (
          <div className="responsive-grid">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
              />
            ))}
          </div>
        )}
      </Flex>
    </Container>
  );
};

export default AppointmentsPage;
