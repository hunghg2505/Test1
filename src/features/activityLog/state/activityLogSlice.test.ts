import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "apiConfig/config";
import MainAPI from "apiConfig/MainAPI";
import axios from "axios";
import { defaultInitialState } from "redux/constant";
import { Status } from "redux/enum";
import { ActivityLogState } from "../model/activityLog";
import counterReducer, { fetchAsyncActivityLog, resetActivityLog, selectActivityLog } from "./activityLogSlice";

const initialState: ActivityLogState = {
  ...defaultInitialState,
  activityLogs: null,
  nextToken: null,
  totalRows: 0,
};

const mockResponse = {
  items: [
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
  nextToken: "abcd",
  totalRows: 2,
}

describe("ActivityLog list reducer", () => {
  it("should handle initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual({
      activityLogs: null,
      status: Status.INITIAL,
      errorMessage: null,
      nextToken: null,
      totalRows: 0,
    });
  });

  it("should handle resetActivityLog", () => {
    const actual = counterReducer(
      {
        status: Status.LOADED,
        errorMessage: "error",
        activityLogs: { mock: "mock" } as any,
        nextToken: null,
        totalRows: 0,
      },
      resetActivityLog(),
    );
    expect(actual.activityLogs).toBeNull();
    expect(actual.status).toEqual(Status.INITIAL);
    expect(actual.errorMessage).toBeNull();
  });

  it("should get activityLogs list from selector", () => {
    const activityLog = selectActivityLog({
      activityLog: "mock",
    } as any);
    expect(activityLog).toEqual("mock");
  });
});

describe("ActivityLog list reducer async actions", () => {
  it("should set status to LOADING", async () => {
    const action = { type: fetchAsyncActivityLog.pending.type };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: Status.LOADING,
    });
  });

  it("should set status to LOADED with correct value", async () => {
    const action = {
      type: fetchAsyncActivityLog.fulfilled.type,
      payload: mockResponse,
    };
    const state = counterReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: Status.LOADED,
      activityLogs: mockResponse.items,
      nextToken: mockResponse.nextToken,
      totalRows: mockResponse.totalRows,
    });
  });

  it("should set status to ERROR", async () => {
    const action = {
      type: fetchAsyncActivityLog.rejected.type,
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
      type: fetchAsyncActivityLog.rejected.type,
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
