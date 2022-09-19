import { fireEvent, render, screen, waitFor, within } from "test-utils";
import userEvent from "@testing-library/user-event";
import ActivityLogTable from "./ActivityLogTable";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";

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

const errorState = {
  activityLogs: null,
  status: Status.ERROR,
  errorMessage: null,
};

describe("ActivityLogTable Unit Tests", () => {
  let store: Store;
  const tablePage = 0;
  const rowsTablePerPage = 10;
  const handleOnChangePage = jest.fn();

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <ActivityLogTable page={tablePage} rowsPerPage={rowsTablePerPage} onChangePage={handleOnChangePage} />
      </ReduxProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("ActivityLogTable should render", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const dateTime = screen.getByText("2022-07-11T12:01:45");
    expect(dateTime).toBeInTheDocument();
  });

  it("Should show empty text", () => {
    store = mockConfigureStore([thunk])({
      ...loadedEmptyState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const empty = screen.getByText("No available data");
    expect(empty).toBeInTheDocument();
  });

  it("Should show empty text when error", () => {
    store = mockConfigureStore([thunk])({
      ...errorState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const empty = screen.getByText("No available data");
    expect(empty).toBeInTheDocument();
  });

  it("Should show next page when click change page", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      activityLogs: [
        {
          userId: "1",
        },
        {
          userId: "2",
        },
        {
          userId: "3",
        },
        {
          userId: "4",
        },
        {
          userId: "5",
        },
        {
          userId: "6",
        },
        {
          userId: "7",
        },
        {
          userId: "8",
        },
        {
          userId: "9",
        },
        {
          userId: "10",
        },
        {
          userId: "11",
        },
      ],
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByTitle("Go to next page");
    userEvent.click(button);
    await waitFor(() => expect(handleOnChangePage).toHaveBeenCalledTimes(1));
  });

  it("Should call handleOnChangePage when click change page", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      activityLogs: [
        {
          userId: "1",
        },
        {
          userId: "2",
        },
        {
          userId: "3",
        },
        {
          userId: "4",
        },
        {
          userId: "5",
        },
        {
          userId: "6",
        },
        {
          userId: "7",
        },
        {
          userId: "8",
        },
        {
          userId: "9",
        },
        {
          userId: "100",
        },
        {
          userId: "11",
        },
      ],
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("10");
    fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("25"));
    expect(handleOnChangePage).toHaveBeenCalledTimes(1);
  });
});
