import { Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoctorCard from "../../components/doctors/DoctorCard";
import SpecialtyFilter from "../../components/doctors/SpecialtyFilter";
import Pagination from "../../components/common/Pagination";
import LoadingState from "../../components/common/LoadingState";
import {
  useDoctorsBySpecialty,
} from "../../hooks/useDoctors";
import getApiError from "../../utils/apiError";
import { SPECIALTIES } from "../../utils/specialties";

const DoctorsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const specialties = SPECIALTIES;
  const selectedSpecialty = searchParams.get("specialty") || specialties[0];
  const doctorsQuery = useDoctorsBySpecialty(selectedSpecialty, page, 10);
  const doctors = doctorsQuery.data?.data?.doctors ?? [];
  const pagination = doctorsQuery.data?.data?.pagination;

  const handleSpecialtyChange = (specialty) => {
    setPage(1);
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
          <LoadingState />
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
        <Pagination pagination={pagination} onPageChange={setPage} />
      </Flex>
    </Container>
  );
};

export default DoctorsPage;
