import { fireEvent, render, screen, within } from "test-utils";
import UserTable from "./UserTable";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";

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

describe("UserTable Unit Tests", () => {
  let store: Store;
  const handleOnChangePage = jest.fn();
  const handleOnClickUserInfo = jest.fn();
  const handleOnClickAbcCoin = jest.fn();
  const handleOnClickVoucher = jest.fn();
  const handleOnClickNft = jest.fn();
  const handleOnClickActivityLog = jest.fn();

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <UserTable
          page={0}
          rowsPerPage={10}
          onChangePage={handleOnChangePage}
          onClickUserInfo={handleOnClickUserInfo}
          onClickAbcCoin={handleOnClickAbcCoin}
          onClickVoucher={handleOnClickVoucher}
          onClickNft={handleOnClickNft}
          onClickActivityLog={handleOnClickActivityLog}
        />
      </ReduxProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("UserTable should render", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const name = screen.getByText("Phu Ja");
    expect(name).toBeInTheDocument();
  });

  it("Should render message when user not found", () => {
    store = mockConfigureStore([thunk])({
      ...loadedEmptyState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const emptyText = screen.getByText("Sorry, no matching records found");
    expect(emptyText).toBeInTheDocument();
  });

  it("Should show inactive clip when has deactivatedAt", () => {
    store = mockConfigureStore([thunk])({
      ...loadedEmptyState,
      walletUserList: [
        {
          ...loadedState.walletUserList[0],
          deactivatedAt: "mockDate",
        },
      ],
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const inactiveText = screen.getByText("Inactive");
    expect(inactiveText).toBeInTheDocument();
  });

  it("Should call handleOnClickUserInfo when click User info", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("User info");
    button.click();
    expect(handleOnClickUserInfo).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnClickAbcCoin when click ABC Coin", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("ABC Coin");
    button.click();
    expect(handleOnClickAbcCoin).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnClickVoucher when click Voucher", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("Voucher");
    button.click();
    expect(handleOnClickVoucher).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnClickNft when click NFT", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("NFT");
    button.click();
    expect(handleOnClickNft).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnClickActivityLog when click Activity log", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("Activity log");
    button.click();
    expect(handleOnClickActivityLog).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnChangePage when click go to next page", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      total: 11,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByTitle("Go to next page");
    button.click();
    expect(handleOnChangePage).toHaveBeenCalledTimes(1);
  });

  it("Should call handleOnChangePage when click change page", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      total: 11,
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
