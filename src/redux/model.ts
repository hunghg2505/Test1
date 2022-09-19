import { Status } from "./enum";

export interface DefaultInitialState {
  status: Status;
  errorMessage: string | null;
}
