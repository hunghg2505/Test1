import { DefaultInitialState } from "../../../redux/model";

export interface WalletUserListState extends DefaultInitialState {
  walletUserList: WalletUser[] | null;
  total: number;
}

export interface WalletUser {
  id: number;
  mobileNumber: string;
  thaiID: string;
  firstNameEN: string;
  middleNameEN: string;
  lastNameEN: string;
  firstNameTH: string;
  middleNameTH: string;
  lastNameTH: string;
  abcChainAccount: string;
  deactivatedAt: string;
}

export interface SearchInput {
  searchValue: string;
  searchType: string;
}

export interface ProfilesParams extends SearchInput {
  limit: number;
  page: number;
}
