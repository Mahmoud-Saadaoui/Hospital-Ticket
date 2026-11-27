const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue.";

const TITLE_ERROR_KEYS = {
  "Invalid credentials": "errors.invalidCredentials",
  Unauthorized: "errors.unauthorized",
  Forbidden: "errors.forbidden",
  "User already exists": "errors.userAlreadyExists",
  "Patient already have ticket": "appointment.alreadyBooked",
  "All tickets for today are booked": "appointment.fullyBooked",
  "Appointment is booked": "appointment.booked",
};

const STATUS_ERROR_KEYS = {
  400: "errors.invalidRequest",
  401: "errors.unauthorized",
  403: "errors.forbidden",
  404: "errors.notFound",
  409: "errors.conflict",
  413: "errors.tooLarge",
  429: "errors.tooManyRequests",
};

const getApiError = (error, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  const response = error?.response;
  const payload = response?.data;
  const status = response?.status ?? null;
  const fieldErrors = payload?.data?.errors ?? null;
  const title = payload?.data?.title;

  const message =
    title ||
    payload?.data?.message ||
    payload?.message ||
    (error?.request ? "Le serveur est inaccessible." : null) ||
    error?.message ||
    fallbackMessage;

  return {
    status,
    responseStatus: payload?.status ?? null,
    title,
    message,
    translationKey: TITLE_ERROR_KEYS[title] || STATUS_ERROR_KEYS[status] || null,
    fieldErrors,
    isNetworkError: !response && Boolean(error?.request),
  };
};

export const getApiErrorMessage = (
  error,
  fallbackMessage = DEFAULT_ERROR_MESSAGE,
  translate
) => {
  const apiError = getApiError(error, fallbackMessage);

  if (translate && apiError.translationKey) {
    return translate(apiError.translationKey, { defaultValue: apiError.message });
  }

  return apiError.message;
};

export const getApiErrorStatus = (error) => error?.response?.status ?? null;

export default getApiError;
