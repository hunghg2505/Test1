import { render, screen } from "test-utils";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";
import { UserCoinBalanceState } from "features/walletUser/model/userCoinBalance";
import UserCoinBalance from "./UserCoinBalance";

const loadedState: UserCoinBalanceState = {
  coinBalance: {
    account: "0xc0Fe4a0d3bAA877a25558261AD4f376c7C654e3A",
    balance: "1087.09",
  },
  errorMessage: null,
  status: Status.LOADED,
};

const loadingState: UserCoinBalanceState = {
  coinBalance: null,
  errorMessage: null,
  status: Status.LOADING,
};

describe("UserCoinBalance Unit Tests", () => {
  let store: Store;
  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <UserCoinBalance />
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

  it("should render user total coin balace", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const balance = screen.getByText("1,087.09 ABC");
    expect(balance).toBeInTheDocument();
  });
});
