import { DefaultInitialState } from "../../../redux/model";

export interface WalletUserProfileState extends DefaultInitialState {
  walletUserProfile: WalletUserProfile | null;
}

export interface WalletUserProfile {
  id: number;
  mobileNumber: string;
  thaiID: string;
  passportNumber: string;
  firstNameEN: string;
  middleNameEN: string;
  lastNameEN: string;
  firstNameTH: string;
  middleNameTH: string;
  lastNameTH: string;
  tmwID: string;
  dateOfBirth: string;
  ialLevel: string;
  kycLevel: string;
  nationality: string;
  abcChainAccount: string;
  walletIndex: number;
  address: string;
  district: string;
  subDistrict: string;
  province: string;
  postalCode: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string;
  deactivationReason: string;
}
