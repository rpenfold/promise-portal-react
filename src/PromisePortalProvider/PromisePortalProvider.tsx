import React, { Suspense, useState, useCallback, startTransition } from "react";
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
import { buildAwaitablePortal, buildPortal } from "./portalFactory";
import { ProviderInternalContext, MatchPortalPredicate } from "./types";
import getComponentName from "../utils/getComponentName";
import checkIsClassComponent from "../utils/checkIsClassComponent";

/**
 * Removes all components. Iterates across all existing components and cancels them individually. This
 * allows for proper cleanup.
 */
export const clearPortals =
  (portals: Array<Portal>) =>
  (predicate?: MatchPortalPredicate): void => {
    portals.forEach((portal) => {
      if (
        !predicate ||
        predicate(getComponentName(portal.Component), portal.props)
      ) {
        portal.onCancel();
      }
    });
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
    <P extends ComponentProps, T>(
      component: ComponentParam<P>,
      props: ComponentProps = {},
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

        startTransition(() => {
          setPortals(addPortalUpdater(portal));
        })
      });
    },
    []
  );

  const showPortal = <P extends ComponentProps>(
    component: ComponentParam<P>,
    props?: P,
  ) => {
    const Component = (
      typeof component === "string"
        ? ComponentRegistry.find(component)
        : component
    ) as PortalComponentType<P>;
    const ref = checkIsClassComponent(Component) ? React.createRef() : null;
    const portal = buildPortal(ref)(Component, props, internalContext);

    startTransition(() => {
      setPortals(addPortalUpdater(portal));
    });
    return {
      cancel: portal.onCancel,
      ref,
      requestClose: portal.onRequestClose,
    };
  };

  const actions = {
    showPortalAsync,
    showPortal,
    clear,
  };

  return (
    <PromisePortalContext.Provider value={actions}>
      {children}
      <Suspense fallback={null}>
        {portals.map((portal, index) => {
          return <PromiseComponent key={portal.id} index={index} data={portal} />;
        })}
        <Dispatcher {...actions} />
      </Suspense>
    </PromisePortalContext.Provider>
  );
};

export default React.memo(PromisePortalProvider);
