import React from "react";
import type { PromisePortalActions } from "./types";

const DEFAULT_ERROR_MSG = "No provider found";

export const defaultValue: PromisePortalActions = {
  showPortal: () => {
    throw Error(DEFAULT_ERROR_MSG);
  },
  showPortalAsync: () =>
    new Promise((_resolve, reject) => reject(DEFAULT_ERROR_MSG)),
  clear: () => {
    throw Error(DEFAULT_ERROR_MSG);
  },
};

const PromisePortalContext =
  React.createContext<PromisePortalActions>(defaultValue);

export default PromisePortalContext;
