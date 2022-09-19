import { render, screen, fireEvent, waitFor } from "test-utils";
import WalletUser from "../WalletUser/index";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";
import userEvent from "@testing-library/user-event";

const mockedUsedNavigate = jest.fn();
const mockedUsedLocation = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
    useLocation: () => mockedUsedLocation,
  };
});

const mockFetchAsyncWalletUserList = jest.fn();
jest.mock("../../features/walletUser/state/walletUserListSlice", () => {
  return {
    ...jest.requireActual("../../features/walletUser/state/walletUserListSlice"),
    fetchAsyncWalletUserList: () => mockFetchAsyncWalletUserList,
  };
});

const initialState = {
  walletUserList: null,
  total: 0,
  status: Status.INITIAL,
  errorMessage: null,
};

const loadingState = {
  walletUserList: null,
  total: 0,
  status: Status.LOADING,
  errorMessage: null,
};

const loadedState = {
  walletUserList: [
    {
      abcChainAccount: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3A1",
      firstNameEN: "Phu",
      firstNameTH: "ภู",
      id: 709,
      lastNameEN: "Ja",
      lastNameTH: "จา",
      middleNameEN: "",
      middleNameTH: "",
      mobileNumber: "0811111104",
    },
  ],
  total: 1,
  status: Status.LOADED,
  errorMessage: null,
};

const loadedEmptyState = {
  walletUserList: [],
  total: 0,
  status: Status.LOADED,
  errorMessage: null,
};

const mockUseLocation = (isForgetMe = false) => {
  mockedUsedLocation.mockReturnValue({
    state: {
      isForgetMe,
    },
  });
};

describe("WalletUser Unit Tests", () => {
  let store: Store;

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <WalletUser />
      </ReduxProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("WalletUser should render", () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...initialState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const name = screen.getAllByText("Search Wallet User");
    expect(name[1]).toBeInTheDocument();
  });

  it("Should render progressbar on loading", () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...loadingState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("Should render table on loaded", () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progressbar = screen.getByRole("table");
    expect(progressbar).toBeInTheDocument();
  });

  it("Should call handleOnClickSearch when click Search", async () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "120" } });
    const button = screen.getByText("SEARCH");
    userEvent.click(button);
    await waitFor(() => {
      expect(mockFetchAsyncWalletUserList).toHaveBeenCalledTimes(1);
    });
  });

  it("Should not call handleOnClickSearch if input value is null", async () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("SEARCH");
    userEvent.click(button);
    await waitFor(() => {
      expect(mockFetchAsyncWalletUserList).not.toHaveBeenCalled();
    });
  });

  it("Should show required error message and clear it when click Reset", async () => {
    mockUseLocation();
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const errorMessageContent = "Required fields must be filled in.";
    const button = screen.getByText("SEARCH");
    userEvent.click(button);
    const errorMessage = await screen.findByText(errorMessageContent);
    expect(errorMessage).toBeInTheDocument();

    const resetButton = screen.getByText("RESET");
    resetButton.click();
    await waitFor(() => {
      expect(screen.queryByText(errorMessageContent)).not.toBeInTheDocument();
    });
  });

  it("Should call fetchAsyncWalletUserList when click go to next page", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      total: 11,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByTitle("Go to next page");
    userEvent.click(button);
    await waitFor(() => {
      expect(mockFetchAsyncWalletUserList).toHaveBeenCalledTimes(1);
    });
  });

  it("Should navigate to user profile when click User info", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("User info");
    button.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });
});
