import { DefaultInitialState } from "redux/model";

export interface UserCoinBalanceState extends DefaultInitialState {
  coinBalance: {
    account: string,
    balance: string
  } | null
}

export interface UserCoinBalanceParams {
  abcChainAccount: string
}