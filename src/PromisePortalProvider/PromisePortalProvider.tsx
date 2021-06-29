import React, { ErrorInfo, useCallback } from "react";
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
} from './updaters';
import Dispatcher from "../Dispatcher";

export type SetPortals = React.Dispatch<React.SetStateAction<Portal[]>>;

export interface ProviderInternalContext {
  countRef: React.MutableRefObject<number>;
  removePortal(id: number): void;
  requestClosePortal(id: number): void;
  SetPortals: SetPortals;
}

/**
 * Removes all components. Iterates across all existing components and cancels them individually. This
 * allows for proper cleanup.
 */
export const clearPortals = (portals: Array<Portal>) => () => {
  portals.forEach((portal) => portal.onCancel());
};

/**
 * Builds a portal.
 */
export const buildPortal =  <T,>(
  resolve: (value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>) => void,
  reject: (value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>) => void,
) => (
  id: number,
  Component: PortalComponentType,
  props: ComponentProps,
  context: ProviderInternalContext
): Portal<T> => ({
  id,
  Component,
  open: true,
  props,
  forceShow: true,
  onCancel: (data?: T): void => {
    resolve({ cancelled: true, data });
    context.removePortal(id);
  },
  onComplete: (data?: T): void => {
    resolve({ cancelled: false, data });
    context.removePortal(id);
  },
  onError: (error: Error, errorInfo: ErrorInfo): void => {
    reject({ cancelled: false, error, errorInfo });
    context.removePortal(id);
  },
  onRequestClose: (): void => context.requestClosePortal(id),
});

export const PromisePortalProvider: React.FC<Props> = ({ children }: Props) => {
  const [portals, SetPortals] = React.useState<Array<Portal>>([]);
  const count = React.useRef(0);

  const removePortal = useCallback(
    composeUpdater<[id: number]>(SetPortals, removePortalByIdUpdater)
  , []);

  const requestClosePortal = useCallback(
    composeUpdater<[id: number]>(SetPortals, modifyPortalByIdUpdater({ open: false }))
  , []);

  const clear = useCallback(
    clearPortals(portals)
  , [portals]);

  const internalContext = {
    countRef: count,
    removePortal,
    requestClosePortal,
    SetPortals,
  };

  const showPortalAsync = useCallback(
    <T,>(
      component: ComponentParam,
      props: ComponentProps = {}
    ): Promise<PromiseComponentResult<T>> => {
      const id = count.current++;
      const Component = (typeof component === "string"
        ? ComponentRegistry.find(component)
        : component
      ) as PortalComponentType;

      return new Promise((resolve, reject) => {
        const portal = buildPortal<T>(resolve, reject)(id, Component, props, internalContext) as Portal;

        SetPortals(addPortalUpdater(portal));
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
        return (
          <PromiseComponent key={portal.id} index={index} data={portal} />
        );
      })}
      <Dispatcher {...actions} />
    </PromisePortalContext.Provider>
  );
};

export default React.memo(PromisePortalProvider);
