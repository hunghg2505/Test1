import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "apiConfig/config";
import MainAPI from "apiConfig/MainAPI";
import axios from "axios";
import { defaultInitialState } from "redux/constant";
import { Status } from "redux/enum";
import { NftState } from "../model/nftList";
import counterReducer, {
  fetchAsyncNftList,
  resetNftList,
  selectNftList,
} from "./nftListSlice";

const initialState: NftState = {
  ...defaultInitialState,
  nft: null,
};

const mockResponse = {
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
        },
      ],
    },
  ],
  totalCollection: 1,
  totalToken: 1,
};

const mockTokenMetadata = {
  animation_url: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.mp4",
  description: "Jun14",
  external_url: "",
  image: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.png",
  name: "Dave Starbelly",
};

describe("Nft list reducer", () => {
  it("should handle initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual({
      nft: null,
      status: Status.INITIAL,
      errorMessage: null,
    });
  });

  it("should handle resetNftList", () => {
    const actual = counterReducer(
      {
        status: Status.LOADED,
        errorMessage: "error",
        nft: { mock: "mock" } as any,
      },
      resetNftList()
    );
    expect(actual.nft).toBeNull();
    expect(actual.status).toEqual(Status.INITIAL);
    expect(actual.errorMessage).toBeNull();
  });

  it("should get nft list from selector", () => {
    const nftList = selectNftList({
      nftList: "mock",
    } as any);
    expect(nftList).toEqual("mock");
  });
});

describe("Nft list reducer async actions", () => {
  it("should set status to LOADING", async () => {
    const action = { type: fetchAsyncNftList.pending.type };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: Status.LOADING,
    });
  });

  it("should set status to LOADED with correct value", async () => {
    const action = {
      type: fetchAsyncNftList.fulfilled.type,
      payload: mockResponse,
    };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: Status.LOADED,
      nft: mockResponse,
    });
  });

  it("should set status to ERROR", async () => {
    const action = {
      type: fetchAsyncNftList.rejected.type,
      payload: {
        data: "loading error",
      },
    };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      errorMessage: "loading error",
      status: Status.ERROR,
    });
  });

  it("should set status to ERROR with null on errorMessage", async () => {
    const action = {
      type: fetchAsyncNftList.rejected.type,
      payload: null,
    };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      errorMessage: null,
      status: Status.ERROR,
    });
  });
});

describe("FetchAsyncNftList", () => {
  it("should return data correctly", async () => {
    const mainAPIGetSpy = jest.spyOn(MainAPI, "get").mockResolvedValueOnce({
      data: mockResponse,
    });

    const axiosGetSpy = jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: mockTokenMetadata,
      request: {
        responseURL: "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.json",
      },
    });

    const store = configureStore({
      reducer: function (_, action) {
        return action.payload;
      },
    });
    const response = await store.dispatch(fetchAsyncNftList("109"));
    expect(mainAPIGetSpy).toBeCalledWith(
      `${apiService.nft}/nft/tokens?profileID=109`
    );

    expect(axiosGetSpy).toBeCalledWith(
      "https://abc-nft-data-dev.s3.amazonaws.com/mock/2.json"
    );

    expect(response.payload).toEqual({
      ...mockResponse,
      collections: [
        {
          ...mockResponse.collections[0],
          tokens: [
            {
              ...mockResponse.collections[0].tokens[0],
              metadata: mockTokenMetadata,
            },
          ],
        },
      ],
    });
  });

  it("should return error data", async () => {
    jest.spyOn(MainAPI, "get").mockRejectedValueOnce({
      response: {
        status: 500,
        data: "error message",
      },
    });

    const store = configureStore({
      reducer: function (_, action) {
        return action.payload;
      },
    });
    const response = await store.dispatch(fetchAsyncNftList("109"));
    expect(response.payload).toEqual({
      status: 500,
      data: "error message",
    });
  });
});
