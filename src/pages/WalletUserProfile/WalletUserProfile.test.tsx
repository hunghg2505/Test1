import { render, screen } from "test-utils";
import WalletUserProfile from "../WalletUserProfile/index";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";
import { useParams, useSearchParams } from "react-router-dom";
import { Tab } from "features/walletUser/enums/Tab";

const defaultWindow = global.window;

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
  };
});

const mockFetchAsyncWalletUserProfile = jest.fn();
jest.mock("../../features/walletUser/state/walletUserProfileSlice", () => {
  return {
    ...jest.requireActual("../../features/walletUser/state/walletUserProfileSlice"),
    fetchAsyncWalletUserProfile: () => mockFetchAsyncWalletUserProfile,
  };
});

const initialState = {
  walletUserProfile: null,
  status: Status.INITIAL,
  errorMessage: null,
};

const loadedState = {
  walletUserProfile: {
    id: 174,
    tmwID: "2f72b96a-7a32-4937-a0f7-6f6bbf27435a",
    mobileNumber: "+6698866006",
    nationality: "THA",
    thaiID: "2232941025124",
    passportNumber: "A123456",
    abcChainAccount: "0xebce14cca72c86f7e9b30a6db2fa7f27fcbddb5a",
    walletIndex: 100173,
    preferredLanguage: "th",
    firstNameEN: "Cleo",
    middleNameEN: "X",
    lastNameEN: "Streich",
    firstNameTH: "จอห์น",
    middleNameTH: "เอ็กศ์",
    lastNameTH: "โด",
    dateOfBirth: "2000/01/24",
    address: "",
    profilePicture: "",
    district: "",
    subDistrict: "",
    province: "",
    postalCode: "",
    createdAt: "2022-06-29T07:13:24.385Z",
    updatedAt: "2022-06-29T10:16:32.410Z",
    deactivatedAt: "2022-06-29T07:13:24.385Z",
    deactivationReason: "Recycle mobile phone number (20/12/2025 10:03:03)",
  },
  status: Status.LOADED,
  errorMessage: null,
};

const errorState = {
  walletUserProfile: null,
  status: Status.ERROR,
  errorMessage: {
    error: {
      code: 40005,
      title: "Unable to proceed",
      body: "Unable to proceed",
      description: "Pls try again",
    },
  },
};

describe("WalletUserProfile Unit Tests", () => {
  let store: Store;

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <WalletUserProfile />
      </ReduxProvider>,
    );
  };

  beforeEach(() => {
    (useParams as any).mockReturnValue({ id: "100" });
    (useSearchParams as any).mockReturnValue([
      {
        get: () => Tab.USER_INFO,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    global.window = defaultWindow;
  });

  it("WalletUserProfile should render", () => {
    store = mockConfigureStore([thunk])({
      ...initialState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const title = screen.getByText("ABC Wallet User");
    expect(title).toBeInTheDocument();
  });

  it("Should render empty", () => {
    store = mockConfigureStore([thunk])({
      ...initialState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const empty = screen.getByTestId("wallet-user-detail-loading");
    expect(empty).toBeInTheDocument();
  });

  it("Should render not found when no id", () => {
    (useParams as any).mockReturnValue({ id: undefined });
    store = mockConfigureStore([thunk])({
      ...initialState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const notFound = screen.getByText("Wallet user profile not found");
    expect(notFound).toBeInTheDocument();
  });

  it("Should render not found when no data match", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: null,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const notFound = screen.getByText("Wallet user profile not found");
    expect(notFound).toBeInTheDocument();
  });

  it("Should show fullname", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const fullname = screen.queryAllByText("Cleo X Streich");
    expect(fullname[0]).not.toBeNull();
  });

  it("Should show error message", () => {
    store = mockConfigureStore([thunk])({
      ...errorState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const errorMessage = screen.getByText("Oops. Please try again later.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("Should show UserProfileDetail", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const userProfileDetail = screen.getByTestId("user-profile-detail");
    expect(userProfileDetail).toBeInTheDocument();
  });

  it("Should show user info tab", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const userInfoTab = screen.getByText("User info");
    userInfoTab.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    const userProfileDetail = screen.getByTestId("user-profile-detail");
    expect(userProfileDetail).toBeInTheDocument();
  });

  it("Should show abc tab", () => {
    (useSearchParams as any).mockReturnValue([
      {
        get: () => Tab.ABC_COIN,
      },
    ]);
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const tab = screen.getByText("ABC Coin");
    tab.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    // TO DO expect abc coin comp
  });

  it("Should show voucher tab", () => {
    (useSearchParams as any).mockReturnValue([
      {
        get: () => Tab.VOUCHER,
      },
    ]);
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const tab = screen.getByText("Voucher");
    tab.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    // TO DO expect voucher comp
  });

  it("Should show NFT tab", () => {
    (useSearchParams as any).mockReturnValue([
      {
        get: () => Tab.NFT,
      },
    ]);
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const tab = screen.getByText("NFT");
    tab.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    // TO DO expect abc coin comp
  });

  it("Should navigate to activity log", () => {
    (useSearchParams as any).mockReturnValue([
      {
        get: () => Tab.ACTIVITY_LOG,
      },
    ]);
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const tab = screen.getByText("Activity log");
    tab.click();
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });
});
