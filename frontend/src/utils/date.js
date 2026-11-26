export const toDate = (value) => {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, locale = "en", options = {}) => {
  const date = toDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(date);
};

export const formatDateTime = (value, locale = "en") => {
  const date = toDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatTime = (value, locale = "en") => {
  const date = toDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const isPast = (value, referenceDate = new Date()) => {
  const date = toDate(value);
  return date ? date.getTime() <= referenceDate.getTime() : true;
};
