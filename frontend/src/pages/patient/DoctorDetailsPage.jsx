import { Avatar, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppointmentBookingForm from "../../components/appointments/AppointmentBookingForm";

const DoctorDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="6" as="h1">
              {t("common.empty")}
            </Heading>
            <Text color="gray">
              {t("doctor.detailUnavailable")}
            </Text>
            <Link to="/doctors">{t("notFound.backHome")}</Link>
          </Flex>
        </Card>
      </Container>
    );
  }

  const initials = doctor.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  return (
    <Container size="3" py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="5">
        <Card
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex direction="column" gap="4" p="4">
            <Flex align="center" gap="4">
              <Avatar
                size="6"
                src={doctor.profilePhoto?.url}
                fallback={initials}
                radius="full"
              />
              <Flex direction="column" gap="1">
                <Heading size="6" as="h1">
                  {doctor.fullName}
                </Heading>
                <Text color="gray">{doctor.specialty}</Text>
              </Flex>
            </Flex>
            {doctor.bio && <Text>{doctor.bio}</Text>}
          </Flex>
        </Card>

        <AppointmentBookingForm doctorId={doctor._id} />
      </Flex>
    </Container>
  );
};

export default DoctorDetailsPage;
