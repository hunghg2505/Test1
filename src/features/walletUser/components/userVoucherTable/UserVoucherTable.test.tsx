import { render, screen } from "test-utils";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";
import UserVoucherTable from "./UserVoucherTable";

const loadedState = {
  walletUserVoucherList: [
    {
      code: "xx05",
      coinTransfer: { transactionHash: "0xb03fa2765443ccdb2c4428e5472e3938a61d0ebac97541b25702d573ee5e671e" },
      deal: {
        endDateTime: "2045-06-10T17:00:00.000Z",
        merchant: { name: "Chester" },
        title: "80009",
      },
      issuedAt: "2022-07-05T02:09:04.145Z",
    },
  ],
  errorMessage: null,
  status: Status.LOADED,
};

const loadingState = {
  walletUserVoucherList: null,
  errorMessage: null,
  status: Status.LOADING,
};

describe("UserVoucher Unit Tests", () => {
  let store: Store;
  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <UserVoucherTable />
      </ReduxProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("shoud render loading progess", () => {
    store = mockConfigureStore([thunk])({
      ...loadingState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const expectText = screen.getByTestId("progress");
    expect(expectText).toBeInTheDocument();
  });

  it("should render UserVoucherTable", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const expectText = screen.getByText("Purchased Date");
    expect(expectText).toBeInTheDocument();
  });

  it("should render user voucher list", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);

    const transactionId = screen.getByText("0xb03fa2765443ccdb2c4428e5472e3938a61d0ebac97541b25702d573ee5e671e");
    expect(transactionId).toBeInTheDocument();
    const merchantName = screen.getByText("Chester");
    expect(merchantName).toBeInTheDocument();
  });
});
