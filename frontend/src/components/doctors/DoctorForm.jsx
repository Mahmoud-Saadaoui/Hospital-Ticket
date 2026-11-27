import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SPECIALTIES, getSpecialtyLabel } from "../../utils/specialties";

const emptyDoctor = {
  fullName: "",
  specialty: SPECIALTIES[0],
  email: "",
  phone: "",
  bio: "",
};

function DoctorForm({ doctor, isSaving, errorMessage, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => ({
    fullName: doctor?.fullName || emptyDoctor.fullName,
    specialty: doctor?.specialty || emptyDoctor.specialty,
    email: doctor?.email || emptyDoctor.email,
    phone: doctor?.phone || emptyDoctor.phone,
    bio: doctor?.bio || emptyDoctor.bio,
  }));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="doctor-form" onSubmit={handleSubmit}>
      <div className="doctor-form__heading">
        <div>
          <p className="admin-dashboard__eyebrow">
            {doctor ? t("doctor.update") : t("doctor.create")}
          </p>
          <h2>{doctor ? t("doctor.update") : t("doctor.create")}</h2>
        </div>
      </div>

      {errorMessage && (
        <p className="admin-state admin-state--error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="responsive-form">
        <label>
          {t("doctor.fullName")}
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </label>
        <label>
          {t("doctor.specialty")}
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            required
          >
            {SPECIALTIES.map((specialty) => (
              <option key={specialty} value={specialty}>
                {getSpecialtyLabel(specialty, t)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("doctor.email")}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label>
          {t("doctor.phone")}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
        </label>
        <label className="doctor-form__bio">
          {t("doctor.bio")}
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="4"
          />
        </label>
      </div>

      <div className="responsive-actions">
        <button type="submit" className="admin-button" disabled={isSaving}>
          {isSaving ? t("common.loading") : t("common.save")}
        </button>
        {doctor && (
          <button type="button" className="admin-button admin-button--muted" onClick={onCancel}>
            {t("common.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

export default DoctorForm;
