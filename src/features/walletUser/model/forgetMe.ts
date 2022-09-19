import { DefaultInitialState } from "../../../redux/model";

export interface ForgetMeState extends DefaultInitialState {
  forgetMe: string | null;
}
