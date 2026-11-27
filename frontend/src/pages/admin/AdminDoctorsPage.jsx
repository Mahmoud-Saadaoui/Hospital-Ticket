import { useState } from "react";
import { useTranslation } from "react-i18next";
import DoctorForm from "../../components/doctors/DoctorForm";
import DoctorTable from "../../components/doctors/DoctorTable";
import {
  useCreateDoctor,
  useDeleteDoctor,
  useDoctors,
  useUpdateDoctor,
} from "../../hooks/useDoctors";
import { getApiErrorMessage, getApiErrorStatus } from "../../utils/apiError";

const getDoctorsFromResponse = (response) =>
  response?.data?.doctors || response?.doctors || [];

function AdminDoctorsPage() {
  const { t } = useTranslation();
  const doctorsQuery = useDoctors();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const doctors = getDoctorsFromResponse(doctorsQuery.data);
  const queryStatus = getApiErrorStatus(doctorsQuery.error);
  const isEmpty = !doctorsQuery.isLoading && (doctors.length === 0 || queryStatus === 404);
  const mutation = selectedDoctor ? updateMutation : createMutation;
  const mutationError = mutation.error
    ? getApiErrorMessage(mutation.error, t("common.error"), t)
    : "";

  const handleSubmit = async (payload) => {
    setSuccessMessage("");
    try {
      if (selectedDoctor) {
        await updateMutation.mutateAsync({
          doctorId: selectedDoctor._id || selectedDoctor.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setSelectedDoctor(null);
      setSuccessMessage(t("admin.doctorSaved"));
    } catch {
      // The translated mutation error is displayed below the form.
    }
  };

  const handleDelete = async (doctor) => {
    const doctorId = doctor._id || doctor.id;
    if (!window.confirm(t("admin.confirmDelete", { name: doctor.fullName }))) {
      return;
    }

    setSuccessMessage("");
    try {
      await deleteMutation.mutateAsync(doctorId);
      if ((selectedDoctor?._id || selectedDoctor?.id) === doctorId) {
        setSelectedDoctor(null);
      }
      setSuccessMessage(t("admin.doctorDeleted"));
    } catch {
      // The translated mutation error is displayed in the page state.
    }
  };

  return (
    <section className="admin-doctors page-container">
      <header className="admin-dashboard__header">
        <div>
          <p className="admin-dashboard__eyebrow">HOSPITAL / ADMIN</p>
          <h2>{t("patient.doctors")}</h2>
          <p>{t("admin.doctorsDescription")}</p>
        </div>
      </header>

      {successMessage && (
        <p className="admin-state admin-state--success" role="status">
          {successMessage}
        </p>
      )}

      <DoctorForm
        key={selectedDoctor?._id || selectedDoctor?.id || "new"}
        doctor={selectedDoctor}
        isSaving={mutation.isPending}
        errorMessage={mutationError}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedDoctor(null)}
      />

      <section className="admin-list-section" aria-labelledby="doctor-list-title">
        <div className="admin-list-section__heading">
          <h2 id="doctor-list-title">{t("admin.doctorList")}</h2>
          {!doctorsQuery.isLoading && !doctorsQuery.isError && (
            <span>{doctors.length}</span>
          )}
        </div>

        {doctorsQuery.isLoading && (
          <p className="admin-state" role="status">
            {t("common.loading")}
          </p>
        )}

        {doctorsQuery.isError && queryStatus !== 404 && (
          <p className="admin-state admin-state--error" role="alert">
            {getApiErrorMessage(doctorsQuery.error, t("common.error"), t)}
          </p>
        )}

        {isEmpty && (
          <p className="admin-state" role="status">
            {t("admin.noDoctors")}
          </p>
        )}

        {!doctorsQuery.isLoading && !doctorsQuery.isError && doctors.length > 0 && (
          <DoctorTable
            doctors={doctors}
            onEdit={setSelectedDoctor}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        )}

        {deleteMutation.error && (
          <p className="admin-state admin-state--error" role="alert">
            {getApiErrorMessage(deleteMutation.error, t("common.error"), t)}
          </p>
        )}
      </section>
    </section>
  );
}

export default AdminDoctorsPage;
