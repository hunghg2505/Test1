import { CreateCustomTheme } from "./index";

const beforeEachMock = (lang: string) => {
  beforeEach(async () => {
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation((key) => {
        let mockReturnValue;

        // eslint-disable-next-line default-case
        switch (key) {
          case "lang":
            mockReturnValue = lang;
            break;
        }
        return mockReturnValue;
      });
  });
};

describe("Theme in th language Unit Tests", () => {
  beforeEachMock("th");
  it("should render", () => {
    CreateCustomTheme({
      direction: "ltr",
      responsiveFontSizes: true,
      roundedCorners: true,
      theme: "LIGHT",
    });
    expect(localStorage.getItem("lang")).toBe("th");
  });
});

describe("Theme in en language Unit Tests", () => {
  beforeEachMock("en-US");

  it("should render", () => {
    CreateCustomTheme({
      direction: "ltr",
      responsiveFontSizes: true,
      roundedCorners: true,
      theme: "LIGHT",
    });
    expect(localStorage.getItem("lang")).toBe("en-US");
  });
});
