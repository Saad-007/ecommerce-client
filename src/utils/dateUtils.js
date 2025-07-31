// utils/dateUtils.js
import { format, isValid } from 'date-fns';

export const safeFormat = (date, formatStr, fallback = 'N/A') => {
  if (!date) return fallback;
  
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, formatStr) : fallback;
};