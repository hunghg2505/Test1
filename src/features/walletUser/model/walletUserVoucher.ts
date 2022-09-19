import { DefaultInitialState } from "redux/model";

export interface UserVoucherListState extends DefaultInitialState {
  walletUserVoucherList: UserVoucher[] | null
}

export interface UserVoucher {
  code: string
  issuedAt: string
  coinTransfer: {
    transactionHash: string
  }
  deal: {
    title: string
    endDateTime: string
    merchant: {
      name: string
    }
  }
}

export interface UserVoucherParams {
  profileID: string
}