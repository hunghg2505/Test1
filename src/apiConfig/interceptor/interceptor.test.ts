import axios from "axios";
import interceptor from "./interceptor";

const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIwIn0.9bRsgSUsTZCAXhS3kS3cVs0cZtWNv3QOWySOkB8f0u0";

const TestAPI = axios.create({
  baseURL: "testurl",
  headers: {
    "content-type": "application/json",
  },
});

TestAPI.interceptors.request.use(interceptor);

describe("Interceptor Unit Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Should add access token", async () => {
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
      await (TestAPI.interceptors.request as any).handlers[0].fulfilled(config)
    ).toMatchObject(expectedResult);
  });
});
