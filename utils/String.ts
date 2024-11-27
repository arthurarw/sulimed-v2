import { formatInTimeZone } from "date-fns-tz";

export const formatBrazilTime = () => {
  const timeZone = 'America/Sao_Paulo';
  return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss');
};

export const formatBrazilDate = () => {
  const timeZone = 'America/Sao_Paulo';
  return formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd');
};
