import { useMemo, useState } from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { useCreateAppointment } from "../../hooks/useAppointments";
import { getAppointmentSlots } from "../../utils/appointmentSlots";
import { getApiErrorMessage } from "../../utils/apiError";

const getTodayValue = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const AppointmentBookingForm = ({ doctorId }) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const createAppointment = useCreateAppointment();
  const [date, setDate] = useState(getTodayValue);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [successAppointment, setSuccessAppointment] = useState(null);

  const slots = useMemo(() => {
    if (!date) {
      return [];
    }

    return getAppointmentSlots(
      new Date(`${date}T00:00:00`),
      new Date(),
      i18n.language
    );
  }, [date, i18n.language]);

  if (!isAuthenticated) {
    return (
      <Card
        style={{
          backgroundColor: "var(--color-surface-muted)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Flex direction="column" gap="3" p="4">
          <Text>{t("auth.loginTitle")}</Text>
          <Button asChild>
            <Link to="/login">{t("header.login")}</Link>
          </Button>
        </Flex>
      </Card>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSlot) {
      return;
    }

    setSuccessAppointment(null);

    try {
      const response = await createAppointment.mutateAsync({
        doctorId,
        appointmentDate: selectedSlot,
      });
      setSuccessAppointment(response?.data?.appointment ?? null);
      setSelectedSlot("");
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
      <Flex direction="column" gap="4" p="4">
        <Text size="5" weight="bold">
          {t("patient.bookAppointment")}
        </Text>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label style={{ display: "grid", gap: "0.5rem" }}>
              <Text size="2" weight="medium">
                {t("appointment.date")}
              </Text>
              <input
                type="date"
                value={date}
                min={getTodayValue()}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSelectedSlot("");
                }}
                required
                style={{
                  minHeight: "2.5rem",
                  paddingInline: "0.75rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              />
            </label>

            <Flex direction="column" gap="2">
              <Text size="2" weight="medium">
                {t("appointment.time")}
              </Text>
              <div className="responsive-grid">
                {slots.map((slot) => (
                  <Button
                    key={slot.value}
                    type="button"
                    variant={selectedSlot === slot.value ? "solid" : "soft"}
                    onClick={() => setSelectedSlot(slot.value)}
                  >
                    {slot.label}
                  </Button>
                ))}
              </div>
              {slots.length === 0 && (
                <Text color="gray">{t("appointment.invalidTime")}</Text>
              )}
            </Flex>

            {createAppointment.isError && (
              <Text color="red" role="alert">
                {getApiErrorMessage(
                  createAppointment.error,
                  t("errors.generic"),
                  t
                )}
              </Text>
            )}

            <Button
              type="submit"
              disabled={!selectedSlot || createAppointment.isPending}
              aria-busy={createAppointment.isPending}
            >
              {createAppointment.isPending
                ? t("common.loading")
                : t("appointment.book")}
            </Button>
          </Flex>
        </form>

        {successAppointment && (
          <Card
            role="status"
            style={{
              backgroundColor: "var(--color-surface-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Flex direction="column" gap="3" p="3">
              <Text weight="bold">{t("common.success")}</Text>
              <Text>{successAppointment.barcode}</Text>
              {successAppointment.barcodeImage && (
                <img
                  src={successAppointment.barcodeImage}
                  alt={t("appointment.barcode")}
                  style={{ width: "100%", maxWidth: 320 }}
                />
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Card>
  );
};

export default AppointmentBookingForm;
