import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ActivityLogAPI from "apiConfig/ActivityLogAPI";
import { ActivityLog, ActivityLogState, SearchActivityLogInput } from "../model/activityLog";
import { defaultInitialState } from "../../../redux/constant";
import { Status } from "../../../redux/enum";
import { RootState } from "../../../redux/store";
import { ErrorResponse } from "models/error";

export const initialState: ActivityLogState = {
  ...defaultInitialState,
  activityLogs: null,
  nextToken: null,
  totalRows: 0,
};

export const fetchAsyncActivityLog = createAsyncThunk(
  "activityLog/fetchAsyncActivityLog",
  async ({ profileId, startDate, endDate, limit, nextToken }: SearchActivityLogInput, { rejectWithValue }) => {
    try {
      const response = await ActivityLogAPI.post(
        '/graphql',
        {
          'query' : `query SearchActivityLog {
            searchActivityLog(filter: { abcId: { eq: "${profileId}" }, fromDate: { eq: "${startDate}" }, toDate: { eq: "${endDate}" }}, limit: ${limit}${nextToken ? `, nextToken: "${nextToken}"` : "" }) {
              items { track event log_category log_name status scenario at meta { key, value }}
              nextToken
              totalRows
            }
          }`
        })
      return response.data?.data?.searchActivityLog
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  },
);

export const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    resetActivityLog: state => {
      state.activityLogs = null;
      state.nextToken = null;
      state.status = Status.INITIAL;
      state.errorMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAsyncActivityLog.pending, state => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncActivityLog.fulfilled, (state, action) => {
        state.status = Status.LOADED;
        state.activityLogs = state.activityLogs ? [ ...state.activityLogs, ...action.payload?.items ] : action.payload?.items as ActivityLog[];
        state.nextToken = action.payload?.nextToken;
        state.totalRows = parseInt(action.payload?.totalRows) || 0
      })
      .addCase(fetchAsyncActivityLog.rejected, (state, { payload }) => {
        state.status = Status.ERROR;
        state.errorMessage = (payload as ErrorResponse)?.data || null;
      });
  },
});

export const { resetActivityLog } = activityLogSlice.actions;

export const selectActivityLog = (state: RootState) => state.activityLog;

export default activityLogSlice.reducer;
