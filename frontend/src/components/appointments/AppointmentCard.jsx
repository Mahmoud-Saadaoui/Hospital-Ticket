import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../utils/date";
import { getBarcodeImageSource } from "../../utils/barcode";
import { useCancelAppointment } from "../../hooks/useAppointments";
import { getApiErrorMessage } from "../../utils/apiError";
import { getSpecialtyLabel } from "../../utils/specialties";

const AppointmentCard = ({ appointment }) => {
  const { t, i18n } = useTranslation();
  const barcodeImage = getBarcodeImageSource(appointment.barcodeImage);
  const cancelMutation = useCancelAppointment();

  const handleCancel = async () => {
    if (!window.confirm(t("appointment.cancelConfirm"))) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(appointment._id);
    } catch {
      // The mutation error is rendered below without exposing technical details.
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Flex direction="column" gap="3" p="3">
        <Flex direction="column" gap="1">
          <Text size="4" weight="bold">
            {appointment.doctor?.fullName || t("doctor.fullName")}
          </Text>
          <Text color="gray">
            {appointment.doctor?.specialty
              ? getSpecialtyLabel(appointment.doctor.specialty, t)
              : t("doctor.specialty")}
          </Text>
        </Flex>

        <Text>
          {t("appointment.date")}:{" "}
          {formatDateTime(appointment.appointmentDate, i18n.language)}
        </Text>

        <Flex direction="column" gap="2" align="start">
          <Text size="2" weight="bold">
            {t("appointment.barcode")}
          </Text>
          <Text dir="ltr">{appointment.barcode}</Text>
          {barcodeImage && (
            <img
              src={barcodeImage}
              alt={t("appointment.barcode")}
              style={{ width: "100%", maxWidth: 320 }}
            />
          )}
          <Button asChild variant="soft">
            <Link
              to={`/appointments/${appointment._id}`}
              state={{ appointment }}
            >
              {t("appointment.ticket")}
            </Link>
          </Button>
          {cancelMutation.isError && (
            <Text color="red" role="alert">
              {getApiErrorMessage(cancelMutation.error, t("errors.generic"), t)}
            </Text>
          )}
          <Button
            type="button"
            color="red"
            variant="soft"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            aria-busy={cancelMutation.isPending}
          >
            {cancelMutation.isPending
              ? t("common.loading")
              : t("appointment.cancel")}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default AppointmentCard;
