import { Avatar, Button, Card, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DoctorCard = ({ doctor }) => {
  const { t } = useTranslation();
  const initials = doctor.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  return (
    <Card
      size="3"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Flex direction="column" gap="4" p="2">
        <Flex align="center" gap="3">
          <Avatar
            size="5"
            src={doctor.profilePhoto?.url}
            fallback={initials}
            radius="full"
          />
          <Flex direction="column" gap="1">
            <Text size="4" weight="bold">
              {doctor.fullName}
            </Text>
            <Text size="2" color="gray">
              {doctor.specialty}
            </Text>
          </Flex>
        </Flex>

        {doctor.bio && (
          <Text size="2" color="gray">
            {doctor.bio}
          </Text>
        )}

        <Button asChild variant="soft">
          <Link
            to={`/doctors/${doctor._id}`}
            state={{ doctor }}
          >
            {t("patient.bookAppointment")}
          </Link>
        </Button>
      </Flex>
    </Card>
  );
};

export default DoctorCard;
