import { fireEvent, render, screen, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import SearchActivityLog from "./SearchActivityLog";

describe("SearchActivityLog Unit Tests", () => {
  const onClickSearch = jest.fn();

  const beforeEachTest = () => {
    render(<SearchActivityLog profileId={"100"} onClickSearch={onClickSearch} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("SearchActivityLog should render", () => {
    beforeEachTest();
    const inputs = screen.queryAllByRole("textbox");
    expect(inputs[0]).toBeInTheDocument();
  });

  it("Should call onClickSearch", async () => {
    beforeEachTest();
    const buttons = screen.queryAllByRole("button");
    userEvent.click(buttons[0]);
    await waitFor(() => {
      expect(onClickSearch).toHaveBeenCalled();
    });
  });

  it("Should reset form", async () => {
    beforeEachTest();
    const buttons = screen.queryAllByRole("button");
    fireEvent.click(buttons[1]);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("100");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue(dayjs().subtract(7, "day").format("DD/MM/YYYY"));
    expect(screen.getAllByRole("textbox")[2]).toHaveValue(dayjs().format("DD/MM/YYYY"));
  });
});
