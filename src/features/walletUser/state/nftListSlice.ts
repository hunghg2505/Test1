import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Collection, Nft, NftState, Token } from "../model/nftList";
import { defaultInitialState } from "../../../redux/constant";
import { Status } from "../../../redux/enum";
import { RootState } from "../../../redux/store";
import MainAPI from "../../../apiConfig/MainAPI";
import { apiService } from "apiConfig/config";
import axios from "axios";
import { ErrorResponse } from "models/error";

export const initialState: NftState = {
  ...defaultInitialState,
  nft: null,
};

const fetchMetadataURI = async (uri: string) => {
  return axios.get(uri);
};

const getTokenURIPromises = (collections: Collection[]) => {
  let promises = [] as any;
  collections.forEach((collection: Collection) => {
    collection.tokens.forEach((token: Token) => {
      promises = [...promises, fetchMetadataURI(token.tokenURI)];
    });
  });

  return promises;
};

const getFullNft = (
  collections: Collection[],
  tokenMetadatas: PromiseSettledResult<any>[]
) => {
  return collections.map((collection: Collection) => {
    const tokens = collection.tokens.map((token: Token) => {
      const metadata = tokenMetadatas.find(
        (obj: any) => obj.value.request.responseURL === token.tokenURI
      );
      return {
        ...token,
        metadata: (metadata as any).value.data,
      };
    });

    return {
      ...collection,
      tokens,
    };
  });
};

export const fetchAsyncNftList = createAsyncThunk(
  "nftList/fetchAsyncNftList",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await MainAPI.get(
        `${apiService.nft}/nft/tokens?profileID=${id}`
      );

      const tokenURIPromises = getTokenURIPromises(response.data.collections);
      const tokenPromisesResult = await Promise.allSettled(tokenURIPromises);
      const tokenPromisesFulfilled =
        tokenPromisesResult.filter((item) => item.status === "fulfilled") || [];

      const fullNft = getFullNft(
        response.data.collections,
        tokenPromisesFulfilled
      );

      return {
        ...response.data,
        collections: fullNft,
      };
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
);

export const nftListSlice = createSlice({
  name: "nftList",
  initialState,
  reducers: {
    resetNftList: (state) => {
      state.nft = null;
      state.status = Status.INITIAL;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncNftList.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncNftList.fulfilled, (state, { payload }) => {
        state.status = Status.LOADED;
        state.nft = payload as Nft;
      })
      .addCase(fetchAsyncNftList.rejected, (state, { payload }) => {
        state.status = Status.ERROR;
        state.errorMessage = (payload as ErrorResponse)?.data || null;
      });
  },
});

export const { resetNftList } = nftListSlice.actions;

export const selectNftList = (state: RootState) => state.nftList;

export default nftListSlice.reducer;
