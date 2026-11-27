import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../utils/date";
import { getSpecialtyLabel } from "../../utils/specialties";

function AdminAppointmentTable({ appointments, locale }) {
  const { t } = useTranslation();

  return (
    <div className="admin-appointment-table-wrapper">
      <table className="admin-appointment-table">
        <thead>
          <tr>
            <th scope="col">{t("appointment.date")}</th>
            <th scope="col">{t("appointment.barcode")}</th>
            <th scope="col">{t("doctor.fullName")}</th>
            <th scope="col">{t("doctor.specialty")}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td data-label={t("appointment.date")}>
                {formatDateTime(appointment.appointmentDate, locale)}
              </td>
              <td data-label={t("appointment.barcode")}>
                <span dir="ltr" className="admin-appointment-table__barcode">
                  {appointment.barcode}
                </span>
              </td>
              <td data-label={t("doctor.fullName")}>
                {appointment.doctor?.fullName || t("doctor.fullName")}
              </td>
              <td data-label={t("doctor.specialty")}>
                {appointment.doctor?.specialty
                  ? getSpecialtyLabel(appointment.doctor.specialty, t)
                  : t("doctor.specialty")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAppointmentTable;
