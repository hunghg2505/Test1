import { render, screen } from "test-utils";
import userEvent from "@testing-library/user-event";
import ActivityLogRow from "./ActivityLogRow";
import { ActivityLogTableType } from "./ActivityLogTable";

const row: ActivityLogTableType = {
  dateTime: "2022-07-11T12:01:45",
  track: "abc-wallet",
  logCategory: "iam",
  logName: "LOGIN",
  status: "200",
  description: "success",
  meta: [{ key: "key1", value: "value1" }],
};

describe("ActivityLogRow Unit Tests", () => {
  const beforeEachTest = () => {
    render(
      <table>
        <tbody>
          <ActivityLogRow row={row} />
        </tbody>
      </table>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("ActivityLogRow should render", () => {
    beforeEachTest();
    const dateTime = screen.getByText("2022-07-11T12:01:45");
    expect(dateTime).toBeInTheDocument();
  });

  it("Should show more data", async () => {
    beforeEachTest();
    const moreInfo = screen.getByText("More info");
    userEvent.click(moreInfo);
    expect(await screen.findByText("key1")).toBeInTheDocument();
  });
});
