import { useTranslation } from "react-i18next";
import AdminAppointmentTable from "../../components/appointments/AdminAppointmentTable";
import { useAllAppointments } from "../../hooks/useAppointments";
import { getApiErrorMessage, getApiErrorStatus } from "../../utils/apiError";

const getAppointmentsFromResponse = (response) =>
  response?.data?.appointments || response?.appointments || [];

function AdminAppointmentsPage() {
  const { t, i18n } = useTranslation();
  const appointmentsQuery = useAllAppointments();
  const appointments = getAppointmentsFromResponse(appointmentsQuery.data);
  const status = getApiErrorStatus(appointmentsQuery.error);
  const isEmpty = !appointmentsQuery.isLoading && (status === 404 || appointments.length === 0);

  return (
    <section className="admin-appointments page-container">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">HOSPITAL / ADMIN</p>
          <h2>{t("admin.appointmentsTitle")}</h2>
          <p>{t("admin.appointmentsDescription")}</p>
        </div>
        <span className="admin-dashboard__status" role="status">
          {appointmentsQuery.isLoading
            ? t("common.loading")
            : appointmentsQuery.isError && status !== 404
              ? t("common.error")
              : t("admin.appointmentsLoaded")}
        </span>
      </header>

      {appointmentsQuery.isLoading && (
        <p className="admin-state" role="status">
          {t("common.loading")}
        </p>
      )}

      {appointmentsQuery.isError && status !== 404 && (
        <p className="admin-state admin-state--error" role="alert">
          {getApiErrorMessage(appointmentsQuery.error, t("common.error"))}
        </p>
      )}

      {isEmpty && (
        <p className="admin-state" role="status">
          {t("admin.noAppointments")}
        </p>
      )}

      {!appointmentsQuery.isLoading &&
        !appointmentsQuery.isError &&
        appointments.length > 0 && (
          <AdminAppointmentTable
            appointments={appointments}
            locale={i18n.language}
          />
        )}
    </section>
  );
}

export default AdminAppointmentsPage;
