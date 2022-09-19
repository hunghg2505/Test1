import { render, screen } from "test-utils";
import UserProfileDetail from "./UserProfileDetail";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";

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
    profilePicture: "",
    address: "address",
    district: "district",
    subDistrict: "subDistrict",
    province: "province",
    postalCode: "postalCode",
    createdAt: "2022-06-29T07:13:24.385Z",
    updatedAt: "2022-06-29T10:16:32.410Z",
    deactivatedAt: "2022-06-29T07:13:24.385Z",
    deactivationReason: "Recycle mobile phone number (20/12/2025 10:03:03)",
  },
  status: Status.LOADED,
  errorMessage: null,
};

const defaultEmptyValueLength = 1;

describe("UserProfileDetail Unit Tests", () => {
  let store: Store;

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <UserProfileDetail />
      </ReduxProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("UserProfileDetail should render", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const name = screen.getByText("Name (TH):");
    expect(name).toBeInTheDocument();
  });

  it("Should show passport no when thaiId is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        thaiID: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const national = screen.getByText("A123456 | THA");
    expect(national).toBeInTheDocument();
  });

  it("Should show - | THA when thaiId and passport no is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        thaiID: "",
        passportNumber: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const national = screen.getByText("- | THA");
    expect(national).toBeInTheDocument();
  });

  it("Should show thaiId | - when nationality is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        nationality: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const national = screen.getByText("2232941025124 | -");
    expect(national).toBeInTheDocument();
  });

  it("Should show - when thaiId and passport no and nationality is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        thaiID: "",
        passportNumber: "",
        nationality: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const noDatas = screen.queryAllByText("-");
    expect(noDatas).toHaveLength(defaultEmptyValueLength + 1);
  });

  it("Should show - when date is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        createdAt: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const noDatas = screen.queryAllByText("-");
    expect(noDatas).toHaveLength(defaultEmptyValueLength + 1);
  });

  it("Should Active chip when deactivatedAt is not available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        deactivatedAt: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const active = screen.getByText("Active");
    expect(active).toBeInTheDocument();
  });

  it("Should Inactive chip when deactivatedAt is available", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const inactive = screen.getByText("Inactive");
    expect(inactive).toBeInTheDocument();

    const reason = screen.getByText(
      "Recycle mobile phone number (20/12/2025 10:03:03)"
    );
    expect(reason).toBeInTheDocument();
  });

  it("Should Inactive chip with - when deactivatedAt is available but no reason", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        deactivationReason: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const inactive = screen.getByText("Inactive");
    expect(inactive).toBeInTheDocument();
    const noDatas = screen.queryAllByText("-");
    expect(noDatas).toHaveLength(defaultEmptyValueLength + 1);
  });

  it("Should show full address", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const fullAddress = screen.getByText(
      "address district subDistrict province postalCode"
    );
    expect(fullAddress).toBeInTheDocument();
  });

  it("Should show - in address field if no data", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      walletUserProfile: {
        ...loadedState.walletUserProfile,
        address: "",
        district: "",
        subDistrict: "",
        province: "",
        postalCode: "",
      },
    });
    jest
      .spyOn(ReactReduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState());
    beforeEachTest(store);
    const noDatas = screen.queryAllByText("-");
    expect(noDatas).toHaveLength(defaultEmptyValueLength + 1);
  });
});
