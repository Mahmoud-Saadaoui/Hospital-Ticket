import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUploadDoctorImage } from "../../hooks/useDoctors";
import { getApiErrorMessage, getApiErrorStatus } from "../../utils/apiError";

const MAX_IMAGE_SIZE = 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

function DoctorImageUpload({ doctor }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const uploadMutation = useUploadDoctorImage();
  const [validationError, setValidationError] = useState("");
  const doctorId = doctor._id || doctor.id;
  const uploadError = getApiErrorStatus(uploadMutation.error)
    ? t(`upload.errors.${getApiErrorStatus(uploadMutation.error)}`, {
        defaultValue: getApiErrorMessage(uploadMutation.error, t("common.error")),
      })
    : "";

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    setValidationError("");
    uploadMutation.reset();

    if (!file) {
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setValidationError(t("upload.fileTooLarge"));
      event.target.value = "";
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError(t("upload.invalidFormat"));
      event.target.value = "";
      return;
    }

    try {
      await uploadMutation.mutateAsync({ doctorId, file });
    } catch {
      // The translated mutation error is displayed below the control.
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="doctor-image-upload">
      <label className="doctor-image-upload__label">
        <span>{t("upload.chooseImage")}</span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleChange}
          disabled={uploadMutation.isPending}
        />
      </label>
      {uploadMutation.isPending && (
        <span className="doctor-image-upload__status" role="status">
          {t("common.loading")}
        </span>
      )}
      {uploadMutation.isSuccess && (
        <span className="doctor-image-upload__status doctor-image-upload__status--success" role="status">
          {t("upload.success")}
        </span>
      )}
      {(validationError || uploadError) && (
        <span className="doctor-image-upload__status doctor-image-upload__status--error" role="alert">
          {validationError || uploadError}
        </span>
      )}
    </div>
  );
}

export default DoctorImageUpload;
