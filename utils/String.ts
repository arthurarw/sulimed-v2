import { format, formatInTimeZone } from "date-fns-tz";
import { TIMEZONE } from "./Settings";

export const formatBrazilTime = () => {
  return formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
};

export const formatBrazilDate = () => {
  return formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd');
};

export const formatBrazilDateTimeNew = (date: string) => {
  const newDate = format(date.split('T')[0], 'dd/MM/yyyy');
  const time = date.split('T')[1].replace('Z', '');
  return `${newDate} ${time}`;
}

export const anonymizeDocument = (document: string) => {
  const sanitizedInput = document.replace(/\D/g, '');

  if (sanitizedInput.length === 11) {
    return sanitizedInput.replace(/^(\d{3})\d{3}(\d{3})(\d{2})$/, '$1.***.***-$3');
  } else if (sanitizedInput.length === 14) {
    return sanitizedInput.replace(/^(\d{2})\d{3}(\d{3})(\d{4})(\d{2})$/, '$1.***.***/$3-$4');
  } else {
    throw new Error('Invalid CPF or CNPJ format');
  }
}
