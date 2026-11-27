import { useTranslation } from "react-i18next";

function PatientTable({ patients }) {
  const { t } = useTranslation();

  return (
    <div className="doctor-table-wrapper patient-table-wrapper">
      <table className="doctor-table patient-table">
        <thead>
          <tr>
            <th scope="col">{t("patient.id")}</th>
            <th scope="col">{t("auth.nameLabel")}</th>
            <th scope="col">{t("doctor.email")}</th>
            <th scope="col">{t("doctor.phone")}</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td data-label={t("patient.id")}>{patient._id}</td>
              <td data-label={t("auth.nameLabel")}>{patient.fullName}</td>
              <td data-label={t("doctor.email")}>{patient.email}</td>
              <td data-label={t("doctor.phone")}>{patient.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientTable;
