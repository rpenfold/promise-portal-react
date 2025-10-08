import { ComponentProps, Portal } from "../types";

export type SetPortals = React.Dispatch<React.SetStateAction<Portal[]>>;

export type MatchPortalPredicate = (
  componentName: string,
  props: ComponentProps,
) => boolean;

export interface ProviderInternalContext {
  removePortal(id: string): void;
  requestClosePortal(id: string): void;
  setPortals: SetPortals;
}
