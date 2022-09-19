import { fireEvent, render, screen, within } from "test-utils";
import NftListTable from "./NftListTable";
import mockConfigureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";
import userEvent from "@testing-library/user-event";
import thunk from "redux-thunk";
import * as ReactReduxHooks from "../../../../redux/hooks";
import { Store } from "@reduxjs/toolkit";
import { Status } from "redux/enum";

const loadingState = {
  nft: null,
  status: Status.LOADING,
  errorMessage: null,
};

const loadedState = {
  nft: {
    collections: [
      {
        address: "0x24b86ccceaf1359f18e741812d201d5b57af18a6",
        contractURI: "https://abc-nft-data-dev.s3.amazonaws.com/mock/index.json",
        name: "candy-machine-24JUN-1",
        symbol: "CM-3",
        tokens: [
          {
            owner: "0xc0fe4a0d3baa877a25558261ad4f376c7c654e3a",
            tokenID: "2",
            tokenURI: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.json",
            metadata: {
              animation_url: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.mp4",
              description: "Jun14",
              external_url: "",
              image: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.png",
              name: "Dave Starbelly",
            },
          },
        ],
      },
    ],
    totalCollection: 1,
    totalToken: 1,
  },
  status: Status.LOADED,
  errorMessage: null,
};

const emptyState = {
  nft: {
    collections: [],
    totalCollection: 0,
    totalToken: 0,
  },
  status: Status.LOADED,
  errorMessage: null,
};

const errorState = {
  nft: null,
  status: Status.ERROR,
  errorMessage: null,
};

describe("NftListTable Unit Tests", () => {
  let store: Store;

  const beforeEachTest = (_store: Store) => {
    render(
      <ReduxProvider store={_store}>
        <NftListTable id={"100"} />
      </ReduxProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("NftListTable should render", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const name = screen.getByText("Dave Starbelly");
    expect(name).toBeInTheDocument();
  });

  it("Should show empty text", () => {
    store = mockConfigureStore([thunk])({
      ...emptyState,
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

  it("Should show loading progress", () => {
    store = mockConfigureStore([thunk])({
      ...loadingState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("Should show default image when image error", () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const images = screen.queryAllByAltText("NFT image");
    fireEvent.error(images[0]);
    expect(images[0]).toHaveAttribute("src", "GenericErrorImg.svg");
  });

  it("Should show next page when click change page", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      nft: {
        ...loadedState.nft,
        totalToken: 30,
      },
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByTitle("Go to next page");
    userEvent.click(button);

    const nextPage = await screen.findByText("11–20 of 30");
    expect(nextPage).toBeInTheDocument();
  });

  it("Should change row per page when click change", async () => {
    store = mockConfigureStore([thunk])({
      ...loadedState,
      nft: {
        ...loadedState.nft,
        totalToken: 30,
      },
    });
    jest.spyOn(ReactReduxHooks, "useAppSelector").mockImplementation(() => store.getState());
    beforeEachTest(store);
    const button = screen.getByText("10");
    fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("25"));
    const nextPage = await screen.findByText("1–25 of 30");
    expect(nextPage).toBeInTheDocument();
  });
});
