import React, { useState, useCallback } from "react";
import PromisePortalContext from "../PromisePortalContext";
import PromiseComponent from "../PromiseComponent";
import ComponentRegistry from "../ComponentRegistry";
import {
  Portal,
  PortalComponentType,
  PromisePortalProviderProps as Props,
  PromiseComponentResult,
  ComponentParam,
  ComponentProps,
} from "../types";
import {
  composeUpdater,
  addPortalUpdater,
  removePortalByIdUpdater,
  modifyPortalByIdUpdater,
} from "./updaters";
import Dispatcher from "../Dispatcher";
import { buildAwaitablePortal } from "./portalFactory";
import { ProviderInternalContext } from "./types";

/**
 * Removes all components. Iterates across all existing components and cancels them individually. This
 * allows for proper cleanup.
 */
export const clearPortals = (portals: Array<Portal>) => () => {
  portals.forEach((portal) => portal.onCancel());
};

export const PromisePortalProvider: React.FC<Props> = ({ children }: Props) => {
  const [portals, setPortals] = useState<Array<Portal>>([]);

  const removePortal = useCallback(
    composeUpdater<[id: string]>(setPortals, removePortalByIdUpdater),
    []
  );

  const requestClosePortal = useCallback(
    composeUpdater<[id: string]>(
      setPortals,
      modifyPortalByIdUpdater({ open: false })
    ),
    []
  );

  const clear = useCallback(clearPortals(portals), [portals]);

  const internalContext: ProviderInternalContext = {
    removePortal,
    requestClosePortal,
    setPortals,
  };

  const showPortalAsync = useCallback(
    <T,>(
      component: ComponentParam,
      props: ComponentProps = {}
    ): Promise<PromiseComponentResult<T>> => {
      const Component = (
        typeof component === "string"
          ? ComponentRegistry.find(component)
          : component
      ) as PortalComponentType;

      return new Promise((resolve, reject) => {
        const portal = buildAwaitablePortal<T>(resolve, reject)(
          Component,
          props,
          internalContext
        ) as Portal;

        setPortals(addPortalUpdater(portal));
      });
    },
    []
  );

  const actions = {
    showPortalAsync,
    clear,
  };

  return (
    <PromisePortalContext.Provider value={actions}>
      {children}
      {portals.map((portal, index) => {
        return <PromiseComponent key={portal.id} index={index} data={portal} />;
      })}
      <Dispatcher {...actions} />
    </PromisePortalContext.Provider>
  );
};

export default React.memo(PromisePortalProvider);
