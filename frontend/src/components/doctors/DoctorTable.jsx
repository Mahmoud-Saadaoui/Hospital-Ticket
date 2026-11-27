import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import DoctorImageUpload from "./DoctorImageUpload";
import { getSpecialtyLabel } from "../../utils/specialties";

function DoctorTable({ doctors, onEdit, onDelete, isDeleting }) {
  const { t } = useTranslation();

  return (
    <div className="doctor-table-wrapper">
      <table className="doctor-table">
        <thead>
          <tr>
            <th scope="col">{t("upload.image")}</th>
            <th scope="col">{t("doctor.fullName")}</th>
            <th scope="col">{t("doctor.specialty")}</th>
            <th scope="col">{t("doctor.email")}</th>
            <th scope="col">{t("doctor.phone")}</th>
            <th scope="col">{t("common.edit")}</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            const doctorId = doctor._id || doctor.id;
            return (
              <tr key={doctorId}>
                <td data-label={t("upload.image")}>
                  {doctor.profilePhoto?.url ? (
                    <img
                      className="doctor-table__photo"
                      src={doctor.profilePhoto.url}
                      alt={doctor.fullName}
                    />
                  ) : (
                    <span aria-label={t("upload.noImage")}>—</span>
                  )}
                  <DoctorImageUpload doctor={doctor} />
                </td>
                <td data-label={t("doctor.fullName")}>{doctor.fullName}</td>
                <td data-label={t("doctor.specialty")}>
                  {getSpecialtyLabel(doctor.specialty, t)}
                </td>
                <td data-label={t("doctor.email")}>{doctor.email}</td>
                <td data-label={t("doctor.phone")}>{doctor.phone}</td>
                <td data-label={t("common.edit")}>
                  <div className="doctor-table__actions">
                    <button
                      type="button"
                      className="admin-button admin-button--small"
                      onClick={() => onEdit(doctor)}
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--small admin-button--danger"
                      onClick={() => onDelete(doctor)}
                      disabled={isDeleting}
                    >
                      {t("common.delete")}
                    </button>
                    <Link
                      className="admin-button admin-button--small admin-button--muted"
                      to={`/admin/doctors/${doctorId}/patients`}
                    >
                      {t("doctor.patients")}
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorTable;
