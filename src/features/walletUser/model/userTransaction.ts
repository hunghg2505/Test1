import { DefaultInitialState } from "redux/model";

type TrannsactionItem = {
  kind: string;
  transactionHash: string;
  amount: number;
  from: string;
  to: string;
  confirmedAt: string;
  metadata?: {
    mobileNumber?: string;
    from?: string;
  };
};

export interface UserTransactionState extends DefaultInitialState {
  transactionList: {
    total: number;
    items: TrannsactionItem[] | null;
  } | null;
}

export enum KIND_TYPE {
  voucher = "voucher",
  airdrop = "airdrop",
  swap = "swap",
  send = "send",
  receive = "receive",
}

export interface UserTransactionParams {
  profileID: string;
  skip: number;
  limit: number;
}
