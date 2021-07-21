import React from "react";
import PromisePortalContext from "./PromisePortalContext";
import { PromisePortalActions } from "./types";

export default function usePromisePortal(): PromisePortalActions {
  return React.useContext<PromisePortalActions>(PromisePortalContext);
}
