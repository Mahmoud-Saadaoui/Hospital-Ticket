import { Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorCard from "../../components/doctors/DoctorCard";
import SpecialtyFilter from "../../components/doctors/SpecialtyFilter";
import {
  useDoctorsBySpecialty,
} from "../../hooks/useDoctors";
import getApiError from "../../utils/apiError";
import { SPECIALTIES } from "../../utils/specialties";

const DoctorsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const specialties = SPECIALTIES;
  const selectedSpecialty = searchParams.get("specialty") || specialties[0];
  const doctorsQuery = useDoctorsBySpecialty(selectedSpecialty);
  const doctors = doctorsQuery.data?.data?.doctors ?? [];

  const handleSpecialtyChange = (specialty) => {
    if (specialty) {
      setSearchParams({ specialty });
    } else {
      setSearchParams({});
    }
  };

  const doctorsError = doctorsQuery.error
    ? getApiError(doctorsQuery.error, t("errors.generic")).message
    : "";

  return (
    <Container size="4" py={{ initial: "6", sm: "8" }}>
      <Flex direction="column" gap="6">
        <Flex direction="column" gap="2">
          <Heading size={{ initial: "7", sm: "8" }} as="h1">
            {t("patient.doctors")}
          </Heading>
          <Text color="gray">{t("patient.bookAppointment")}</Text>
        </Flex>

        {specialties.length > 0 && (
          <SpecialtyFilter
            specialties={specialties}
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
          />
        )}

        {doctorsQuery.isLoading && selectedSpecialty && (
          <Text role="status" aria-live="polite">
            {t("common.loading")}
          </Text>
        )}

        {doctorsQuery.isError && (
          <Card role="alert">
            <Text color="red">{doctorsError}</Text>
          </Card>
        )}

        {!doctorsQuery.isLoading &&
          !doctorsQuery.isError &&
          selectedSpecialty &&
          doctors.length === 0 && (
            <Text color="gray">{t("common.empty")}</Text>
          )}

        {doctors.length > 0 && (
          <div className="responsive-grid">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </Flex>
    </Container>
  );
};

export default DoctorsPage;
