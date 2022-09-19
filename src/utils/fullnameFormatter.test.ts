import {
  fullnameFormatter,
  fullnameFormatterWithLang,
} from "./fullnameFormatter";

describe("fullnameFormatter Test", () => {
  it("should format fullname", () => {
    expect(
      fullnameFormatter({
        firstName: "first",
        middleName: "middle",
        lastName: "last",
      })
    ).toBe("first middle last");
  });

  it("should format fullname without middlename", () => {
    expect(
      fullnameFormatter({
        firstName: "first",
        lastName: "last",
      })
    ).toBe("first last");
  });

  it("should format fullname without firstname and lastname", () => {
    expect(fullnameFormatter({ middleName: "middle" })).toBe(" middle ");
  });

  it("should format fullname without firstname and middlename and lastname", () => {
    expect(fullnameFormatter({})).toBe(" ");
  });

  describe("fullnameFormatterWithLang Test", () => {
    const mockNameObj = {
      firstNameEN: "firstEN",
      middleNameEN: "middleEN",
      lastNameEN: "lastEN",
      firstNameTH: "firstTH",
      middleNameTH: "middleTH",
      lastNameTH: "lastTH",
    };

    it("should format fullname in TH", () => {
      expect(
        fullnameFormatterWithLang({
          ...mockNameObj,
          lang: "th",
        })
      ).toBe("firstTH middleTH lastTH");
    });

    it("should format fullname in EN", () => {
      expect(fullnameFormatterWithLang(mockNameObj)).toBe(
        "firstEN middleEN lastEN"
      );
    });
  });
});
