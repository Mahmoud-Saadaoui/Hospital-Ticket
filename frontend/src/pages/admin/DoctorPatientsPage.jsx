import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import PatientTable from "../../components/users/PatientTable";
import { useDoctorPatients } from "../../hooks/useDoctors";
import { getApiErrorMessage } from "../../utils/apiError";

const getPatientsFromResponse = (response) =>
  response?.data?.doctorPatients || response?.doctorPatients || [];

function DoctorPatientsPage() {
  const { t } = useTranslation();
  const { id: doctorId } = useParams();
  const patientsQuery = useDoctorPatients(doctorId);
  const patients = getPatientsFromResponse(patientsQuery.data);

  return (
    <section className="admin-doctor-patients page-container">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">HOSPITAL / ADMIN</p>
          <h2>{t("admin.doctorPatientsTitle")}</h2>
          <p>{t("admin.doctorPatientsDescription")}</p>
        </div>
      </header>

      <section className="admin-list-section" aria-labelledby="patient-list-title">
        <div className="admin-list-section__heading">
          <h2 id="patient-list-title">{t("doctor.patients")}</h2>
          {!patientsQuery.isLoading && !patientsQuery.isError && (
            <span>{patients.length}</span>
          )}
        </div>

        {patientsQuery.isLoading && (
          <p className="admin-state" role="status" aria-live="polite">
            {t("common.loading")}
          </p>
        )}

        {patientsQuery.isError && (
          <p className="admin-state admin-state--error" role="alert">
            {getApiErrorMessage(patientsQuery.error, t("common.error"))}
          </p>
        )}

        {!patientsQuery.isLoading && !patientsQuery.isError && patients.length === 0 && (
          <p className="admin-state" role="status">
            {t("admin.noDoctorPatients")}
          </p>
        )}

        {!patientsQuery.isLoading && !patientsQuery.isError && patients.length > 0 && (
          <>
            <p className="admin-state admin-state--success" role="status">
              {t("admin.doctorPatientsLoaded")}
            </p>
            <PatientTable patients={patients} />
          </>
        )}

        <Link className="admin-button admin-button--muted patients-back-link" to="/admin/doctors">
          {t("admin.backToDoctors")}
        </Link>
      </section>
    </section>
  );
}

export default DoctorPatientsPage;
