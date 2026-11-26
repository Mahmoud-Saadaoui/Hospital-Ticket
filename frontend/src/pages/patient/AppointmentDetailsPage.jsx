import { Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { usePatientAppointments } from "../../hooks/useAppointments";
import { formatDateTime } from "../../utils/date";
import { getBarcodeImageSource } from "../../utils/barcode";
import getApiError, { getApiErrorStatus } from "../../utils/apiError";

const AppointmentDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const appointmentFromState = location.state?.appointment;
  const appointmentsQuery = usePatientAppointments(
    appointmentFromState ? undefined : user?.id
  );
  const appointment =
    appointmentFromState ||
    appointmentsQuery.data?.data?.appointments?.find(
      (item) => item._id === id
    );
  const barcodeImage = getBarcodeImageSource(appointment?.barcodeImage);

  if (appointmentsQuery.isLoading && !appointmentFromState) {
    return (
      <Container size="2" py="9">
        <Text role="status" aria-live="polite">
          {t("common.loading")}
        </Text>
      </Container>
    );
  }

  if (!appointment) {
    const isEmptyResponse = getApiErrorStatus(appointmentsQuery.error) === 404;
    const errorMessage = appointmentsQuery.error
      ? getApiError(appointmentsQuery.error, t("errors.generic")).message
      : "";

    return (
      <Container size="2" py="9">
        <Card role={isEmptyResponse ? undefined : "alert"}>
          <Flex direction="column" gap="4" p="4">
            <Heading size="6" as="h1">
              {t("common.empty")}
            </Heading>
            <Text color={isEmptyResponse ? "gray" : "red"}>
              {isEmptyResponse
                ? t("appointment.noAppointments")
                : errorMessage}
            </Text>
            <Link to="/appointments">{t("patient.myAppointments")}</Link>
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="2" py={{ initial: "6", sm: "9" }}>
      <Flex direction="column" gap="5">
        <Heading size={{ initial: "7", sm: "8" }} as="h1">
          {t("appointment.ticket")}
        </Heading>

        <Card
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex direction="column" gap="4" p="4">
            <Text size="4" weight="bold">
              {appointment.doctor?.fullName || t("doctor.fullName")}
            </Text>
            <Text color="gray">
              {appointment.doctor?.specialty || t("doctor.specialty")}
            </Text>
            <Text>
              {t("appointment.date")}:{" "}
              {formatDateTime(appointment.appointmentDate, i18n.language)}
            </Text>
            <Text dir="ltr">{appointment.barcode}</Text>
            {barcodeImage && (
              <img
                src={barcodeImage}
                alt={t("appointment.barcode")}
                style={{ width: "100%", maxWidth: 420 }}
              />
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default AppointmentDetailsPage;
