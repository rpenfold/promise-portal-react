import { Portal } from "types";

export type SetPortals = React.Dispatch<React.SetStateAction<Portal[]>>;

export interface ProviderInternalContext {
  removePortal(id: string): void;
  requestClosePortal(id: string): void;
  setPortals: SetPortals;
}
