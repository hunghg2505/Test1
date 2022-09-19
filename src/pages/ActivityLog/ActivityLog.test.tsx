import { render, screen, fireEvent, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";
import ActivityLog from "../ActivityLog/index";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import { useSearchParams } from "react-router-dom";
import * as ReactReduxHooks from "redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";

jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useSearchParams: jest.fn(),
  };
});

const mockFetchAsyncActivityLog = jest.fn();
jest.mock("../../features/activityLog/state/activityLogSlice", () => {
  return {
    ...jest.requireActual("../../features/activityLog/state/activityLogSlice"),
    fetchAsyncActivityLog: () => mockFetchAsyncActivityLog,
  };
});

const initialState = {
  activityLogs: null,
  status: Status.INITIAL,
  errorMessage: null,
};

const loadingState = {
  activityLogs: null,
  status: Status.LOADING,
  errorMessage: null,
};

const loadedState = {
  activityLogs: [
    {
      at: "2022-07-11T12:01:45",
      event: "LOGIN",
      log_category: "iam",
      log_name: "LOGIN",
      scenario: "success",
      status: "200",
      track: "abc-wallet",
      meta: [{
        key: "abc_id",
        value: "718"
      }, {
        key: "correlation_id", 
        value: "0xC667B5ebD6b122deb3e6c8Cf48433BA5B7FdD2c5"
      }]
    },
    {
      at: "2022-07-11T12:02:45",
      event: "LOGIN",
      log_category: "iam",
      log_name: "LOGIN",
      scenario: "success",
      status: "200",
      track: "abc-wallet",
      meta: [{
        key: "abc_id",
        value: "718"
      }, {
        key: "correlation_id", 
        value: "0xC667B5ebD6b122deb3e6c8Cf48433BA5B7FdD2c5"
      }]
    },
  ],
  status: Status.LOADED,
  errorMessage: null,
};

const loadedEmptyState = {
  activityLogs: [],
  status: Status.LOADED,
  errorMessage: null,
};

describe("ActivityLog Unit Tests", () => {
  let store: Store;

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <ActivityLog />
      </ReduxProvider>,
    );
  };

  beforeEach(() => {
    (useSearchParams as any).mockReturnValue([
      {
        get: () => "100",
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("ActivityLog should render", () => {
    store = mockConfigureStore([thunk])({
      ...initialState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const name = screen.getAllByText("Search Activity Logs");
    expect(name[1]).toBeInTheDocument();
  });

  it("Should render progressbar on loading", () => {
    store = mockConfigureStore([thunk])({
      ...loadingState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("Should render table on loaded", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progressbar = screen.getByRole("table");
    expect(progressbar).toBeInTheDocument();
  });

  it("Should call handleOnClickSearch when click Search", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("SEARCH");
    userEvent.click(button);
    await waitFor(() => {
      expect(mockFetchAsyncActivityLog).toHaveBeenCalledTimes(1);
    });
  });
});
