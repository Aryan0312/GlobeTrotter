import validator from "validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const trimName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePhone = (phone: string): boolean => {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};

export const validateCity = (city: string): boolean => {
  return city.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(city);
};

export const validateCountry = (country: string): boolean => {
  return country.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(country);
};