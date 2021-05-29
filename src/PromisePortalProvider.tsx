import React, { ErrorInfo, useCallback } from "react";
import PromisePortalContext from "./PromisePortalContext";
import PromiseComponent from "./PromiseComponent";
import ComponentRegistry from "./ComponentRegistry";
import {
  Portal,
  PromisePortalProviderProps as Props,
  PromiseComponentResult,
  ComponentParam,
  ComponentProps,
} from "./types";
import Dispatcher from "./Dispatcher";

const PromisePortalProvider: React.FC<Props> = ({ children }: Props) => {
  const [components, setComponents] = React.useState<Array<Portal>>([]);
  const count = React.useRef(0);

  const removeComponent = useCallback((id) => {
    setComponents(components.filter((x) => x.id !== id));
  }, []);

  const requestCloseComponent = useCallback((id) => {
    setComponents(
      components.map((x) => {
        if (x.id === id) {
          x.open = false;
        }

        return x;
      })
    );
  }, []);

  const showPortalAsync = useCallback(
    <T,>(
      component: ComponentParam,
      props: ComponentProps = {}
    ): Promise<PromiseComponentResult<T>> => {
      const id = count.current++;

      const Component =
        typeof component === "string"
          ? ComponentRegistry.find(component)
          : component;

      return new Promise((resolve, reject) => {
        setComponents((components) => [
          ...components,
          {
            id,
            Component,
            open: true,
            props,
            forceShow: true,
            onCancel: (data?: T): void => {
              resolve({ cancelled: true, data });
              removeComponent(id);
            },
            onComplete: (data?: T): void => {
              resolve({ cancelled: false, data });
              removeComponent(id);
            },
            onError: (error: Error, errorInfo: ErrorInfo): void => {
              reject({ cancelled: false, error, errorInfo });
              removeComponent(id);
            },
            onRequestClose: (): void => requestCloseComponent(id),
          } as Portal,
        ]);
      });
    },
    []
  );

  const clear = useCallback(() => {
    components.forEach((component) => component.onCancel());
  }, []);

  const actions = {
    showPortalAsync,
    clear,
  };

  return (
    <PromisePortalContext.Provider value={actions}>
      {children}
      {components.map((component, index) => {
        return (
          <PromiseComponent key={component.id} index={index} data={component} />
        );
      })}
      <Dispatcher {...actions} />
    </PromisePortalContext.Provider>
  );
};

export default PromisePortalProvider;
