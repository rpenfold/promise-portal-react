import React, { ErrorInfo, useCallback, ComponentType } from 'react';
import PromisePortalContext from './PromisePortalContext';
import PromiseComponent from './PromiseComponent';
import ComponentRegistry from './ComponentRegistry';
import { Portal, PortalConfig, PromisePortalProviderProps as Props, PromiseComponentResult, PromisePortalActions } from './types';

export const singleton: PromisePortalActions = {
  show: () => new Promise((resolve, reject) => reject('No provider found')),
};

const PromisePortalProvider: React.FC<Props> = ({ children }: Props) => {
  const [components, setComponents] = React.useState<Array<Portal>>([]);
  const count = React.useRef(0);

  const removeComponent = useCallback(id => {
    setComponents(components.filter(x => x.id !== id));
  }, []);

  const requestCloseComponent = useCallback(id => {
    setComponents(components.map(x => {
      if (x.id === id) {
        x.open = false;
      }

      return x;
    }))
  }, []);

  singleton.show = useCallback((
    component: ComponentType<unknown> | string,
    config: PortalConfig
  ): Promise<PromiseComponentResult> => {
      const id = count.current++;

      const Component = typeof component === 'string'
        ? ComponentRegistry.find(component)
        : component;

      return new Promise((resolve, reject) => {
        setComponents(components => [
          ...components,
          {
            id,
            Component,
            open: true,
            ...config,
            onCancel: (data: unknown): void => {
              reject({ cancelled: true, data });
              removeComponent(id);
            },
            onComplete: (data: unknown): void => {
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
    [],
  );

  return (
    <PromisePortalContext.Provider value={singleton}>
      {children}
      {components.map((component, index) => {
        return (
          <PromiseComponent
            key={component.id}
            index={index}
            data={component}
          />
        );
      })}
    </PromisePortalContext.Provider>
  );
};

export default PromisePortalProvider;
