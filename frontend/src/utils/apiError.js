const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue.";

const getApiError = (error, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  const response = error?.response;
  const payload = response?.data;
  const status = response?.status ?? null;
  const fieldErrors = payload?.data?.errors ?? null;

  const message =
    payload?.data?.title ||
    payload?.data?.message ||
    payload?.message ||
    (error?.request ? "Le serveur est inaccessible." : null) ||
    error?.message ||
    fallbackMessage;

  return {
    status,
    message,
    fieldErrors,
    isNetworkError: !response && Boolean(error?.request),
  };
};

export const getApiErrorMessage = (
  error,
  fallbackMessage = DEFAULT_ERROR_MESSAGE
) => getApiError(error, fallbackMessage).message;

export const getApiErrorStatus = (error) => error?.response?.status ?? null;

export default getApiError;
