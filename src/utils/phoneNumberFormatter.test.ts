import {
  phoneNumberFormatter,
  phoneNumberInputFormatter,
  phoneNumberURIEncoded,
  phoneNumberWithCountryCode,
  phoneNumberWithThaiCountryCode,
  phoneNumberURIEncodedWithThaiCountryCode
} from "./phoneNumberFormatter";

describe("phoneNumberFormatter Test", () => {
  it("should format number", () => {
    expect(phoneNumberFormatter("0855555555")).toBe("085-555-5555");
  });
});

describe("phoneNumberInputFormatter Test", () => {
  it("should format number", () => {
    expect(phoneNumberInputFormatter("0855555555")).toBe("085-555-5555");
  });

  it("should format number when has only 5 digit", () => {
    expect(phoneNumberInputFormatter("08555")).toBe("085-55");
  });

  it("should not format number when number length is less than 4", () => {
    expect(phoneNumberInputFormatter("085")).toBe("085");
  });
});

describe("phoneNumberURIEncodedWithCountryCode Test", () => {
  it("should add country code", () => {
    expect(phoneNumberWithCountryCode("0855555555", "+66")).toBe("+66855555555");
  });

  it("should not add country code in case there already have country code", () => {
    expect(phoneNumberWithCountryCode("+66855555555", "+66")).toBe("+66855555555");
  });

  it("should add Thai country code", () => {
    expect(phoneNumberWithThaiCountryCode("0855555555")).toBe("+66855555555");
  });

  it("should add Thai country code", () => {
    expect(phoneNumberWithThaiCountryCode("+66855555555")).toBe("+66855555555");
  });

  it("should do URI encode", () => {
    expect(phoneNumberURIEncoded("+66855555555")).toBe("%2B66855555555");
  });

  it("should add Thai country code URI encode", () => {
    expect(phoneNumberURIEncodedWithThaiCountryCode("0855555555")).toBe("%2B66855555555");
  });
});