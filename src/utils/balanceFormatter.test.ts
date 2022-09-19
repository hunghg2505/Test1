import { balanceFormatter } from "./balanceFormatter";

describe("BalanceFormatter Unit tests", () => {
  it("should give 1,000 if we put 1000 to format", () => {
    const result = balanceFormatter("1000");
    expect(result).toBe("1,000");
  });
  it("should give 100 if we put 100 to format", () => {
    const result = balanceFormatter("100");
    expect(result).toBe("100");
  });
  it("should give 0 string if we put 0 to format", () => {
    const result = balanceFormatter("0");
    expect(result).toBe("0");
  });
});
