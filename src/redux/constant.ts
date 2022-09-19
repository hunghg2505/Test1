import { DefaultInitialState } from "./model";
import { Status } from "./enum";

export const defaultInitialState: DefaultInitialState = {
  status: Status.INITIAL,
  errorMessage: null,
};
