import { BOOKING_MESSAGES } from './booking.messages';
import { EVENT_MESSAGES } from './event.messages';

export const ERROR_MESSAGES = {
  ...EVENT_MESSAGES,
  ...BOOKING_MESSAGES,
};
