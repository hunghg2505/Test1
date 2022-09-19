export const phoneNumberFormatter = (number: string | number | undefined) => {
  if (number) {
    const cleanedNumber = number.toString();
    return (
      cleanedNumber.slice(0, cleanedNumber.length - 7) +
      "-" +
      cleanedNumber.slice(cleanedNumber.length - 7, cleanedNumber.length - 4) +
      "-" +
      cleanedNumber.slice(cleanedNumber.length - 4)
    );
  }
  return number;
};

export const phoneNumberInputFormatter = (phoneString: string) => {
  if (phoneString.length >= 7) {
    return (
      phoneString.slice(0, 3) +
      "-" +
      phoneString.slice(3, 6) +
      "-" +
      phoneString.slice(6, 12)
    );
  }
  if (phoneString.length >= 4) {
    return phoneString.slice(0, 3) + "-" + phoneString.slice(3, 6);
  }
  return phoneString;
};

export const phoneNumberURIEncoded = (phoneString: string) => {
  return encodeURIComponent(phoneString);
};

export const phoneNumberWithCountryCode = (phoneString : string, countryCode = "") => {
  const plainNumber = phoneString.replace(/-/g, "");
  if (plainNumber.includes("+")) {
    return plainNumber;
  }
  return countryCode + plainNumber.slice(1);
};

export const phoneNumberWithThaiCountryCode = (phoneString: string) =>
  phoneNumberWithCountryCode(phoneString, "+66");

export const phoneNumberURIEncodedWithThaiCountryCode = (phoneString: string) => {
  const phoneNumber = phoneNumberWithCountryCode(phoneString, "+66");
  return phoneNumberURIEncoded(phoneNumber);
};
