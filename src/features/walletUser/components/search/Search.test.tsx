import { SearchType } from "features/walletUser/enums/Search";
import { fireEvent, render, screen, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";
import Search from "./Search";

describe("Search Unit Tests", () => {
  const onClickSearch = jest.fn();
  const onClickReset = jest.fn();

  const beforeEachTest = (errorMessage?: string) => {
    render(<Search errorMessage={errorMessage} onClickSearch={onClickSearch} onClickReset={onClickReset} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Search should render", () => {
    beforeEachTest();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("Should show error message when it has", () => {
    beforeEachTest("mock error message");
    const text = screen.getByText("mock error message");
    expect(text).toBeInTheDocument();
  });

  it("Should call onClickSearch with value when click search button", async () => {
    beforeEachTest();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "120" } });
    const buttons = screen.queryAllByRole("button");
    userEvent.click(buttons[0]);
    await waitFor(() =>
      expect(onClickSearch).toHaveBeenCalledWith({
        searchValue: "120",
        searchType: SearchType.MOBILE_NUMBER,
      }),
    );
  });

  it("Should call onClickSearch with value and type when click search button", async () => {
    beforeEachTest();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "120" } });
    const radio = screen.getByLabelText("Thai ID");
    fireEvent.click(radio);
    const buttons = screen.queryAllByRole("button");
    userEvent.click(buttons[0]);
    await waitFor(() =>
      expect(onClickSearch).toHaveBeenCalledWith({
        searchValue: "120",
        searchType: SearchType.THAI_ID,
      }),
    );
  });

  it("Should call onClickReset and clear value when click reset button", async () => {
    beforeEachTest("mock error message");
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "120" } });
    const radio = screen.getByLabelText("Thai ID");
    fireEvent.click(radio);
    const buttons = screen.queryAllByRole("button");
    userEvent.click(buttons[1]);
    await waitFor(() => expect(onClickReset).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(""));
  });
});
