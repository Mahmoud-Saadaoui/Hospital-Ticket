import { formatTime } from "./date.js";

const OPENING_HOUR = 8;
const CLOSING_HOUR = 16;
const SLOT_DURATION_MINUTES = 30;

const isSameLocalDay = (firstDate, secondDate) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

export const getAppointmentSlots = (
  selectedDate = new Date(),
  referenceDate = new Date(),
  locale = "en"
) => {
  const baseDate = new Date(selectedDate);
  const slots = [];

  for (
    let minutes = OPENING_HOUR * 60;
    minutes < CLOSING_HOUR * 60;
    minutes += SLOT_DURATION_MINUTES
  ) {
    const slot = new Date(baseDate);
    slot.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

    if (isSameLocalDay(slot, referenceDate) && slot <= referenceDate) {
      continue;
    }

    slots.push({
      value: slot.toISOString(),
      label: formatTime(slot, locale),
      date: slot,
    });
  }

  return slots;
};

export const getAppointmentTimeRange = () => ({
  openingHour: OPENING_HOUR,
  closingHour: CLOSING_HOUR,
  slotDurationMinutes: SLOT_DURATION_MINUTES,
});
