import { render, screen, waitFor, fireEvent, within } from "test-utils";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";
import { UserTransactionState } from "features/walletUser/model/userTransaction";
import UserTransactionTable from "./UserTransactionTable";
import userEvent from "@testing-library/user-event";

const loadedState = {
  transactionList: {
    total: 30,
    items: [
      {
        kind: "voucher",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3A",
        amount: 11,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
      {
        kind: "airdrop",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3B",
        amount: 12,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
      {
        kind: "swap",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3D",
        amount: 13,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
      {
        kind: "send",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3W",
        amount: 14,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
      {
        kind: "receive",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3Q",
        amount: 15,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
      {
        kind: "unknow",
        transactionHash: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3Q",
        amount: 16,
        from: "0x1111...",
        to: "0x2222...",
        confirmedAt: "2022-05-17T08:48:15.000Z",
      },
    ],
  },
  walletUserProfile: {
    id: "xxx",
  },
  errorMessage: null,
  status: Status.LOADED,
};

const loadingState: UserTransactionState = {
  transactionList: null,
  errorMessage: null,
  status: Status.LOADING,
};

const mockFetchAsyncUserTransaction = jest.fn();
jest.mock("features/walletUser/state/userTransactionSlice", () => {
  return {
    ...jest.requireActual("features/walletUser/state/userTransactionSlice"),
    fetchAsyncUserTransaction: () => mockFetchAsyncUserTransaction,
  };
});

describe("UserTransactionTable Unit Tests", () => {
  let store: Store;
  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <UserTransactionTable />
      </ReduxProvider>,
    );
  };
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should render loading", () => {
    store = mockConfigureStore([thunk])({
      ...loadingState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progress = screen.getByTestId("progress");
    expect(progress).toBeInTheDocument();
  });

  it("should render table header", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const expectedText = screen.getByText("TRANSACTION AMOUNT");
    expect(expectedText).toBeInTheDocument();
  });

  it("should render transaction id", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const expectedText = screen.getByText("0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3A");
    expect(expectedText).toBeInTheDocument();
  });

  it("should show next page when click change page", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByTitle("Go to next page");
    userEvent.click(button);

    const nextPage = await screen.findByText("11–20 of 30");
    expect(nextPage).toBeInTheDocument();
    await waitFor(() => {
      expect(mockFetchAsyncUserTransaction).toHaveBeenCalled();
    });
  });

  it("should change row per page when click change", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("10");
    fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("25"));
    const nextPage = await screen.findByText("1–25 of 30");
    expect(nextPage).toBeInTheDocument();
    await waitFor(() => {
      expect(mockFetchAsyncUserTransaction).toHaveBeenCalled();
    });
  });
});
