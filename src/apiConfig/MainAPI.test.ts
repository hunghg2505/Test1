import MainAPI from "./MainAPI";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIwIn0.9bRsgSUsTZCAXhS3kS3cVs0cZtWNv3QOWySOkB8f0u0";

describe("MainAPI Interceptor", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("handle valid token", async () => {
    const expectedResult = {
      url: "test",
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    };

    Storage.prototype.getItem = jest.fn(() => mockToken);

    const config = {
      url: "test",
      headers: { Authorization: "", "Accept-language": "" },
    };
    expect(
      await (MainAPI.interceptors.request as any).handlers[0].fulfilled(config)
    ).toMatchObject(expectedResult);
  });
});
