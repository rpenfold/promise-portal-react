import React, { ComponentType, ReactNode } from 'react';
import PromisePortalContext from './PromisePortalContext';
import { PromisePortalActions } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withPromisePortal<Passed>(WrappedComponent: ComponentType<any>): ComponentType<Passed> {
  const wrapComponent: React.FC<Passed> = (props: Passed) => {
    return (
      <PromisePortalContext.Consumer>
        {(context: PromisePortalActions | null): ReactNode =>
          <WrappedComponent {...props as Passed} {...context as PromisePortalActions} />
        }
      </PromisePortalContext.Consumer>
    );
  }

  wrapComponent.displayName = `WithPromisePortal(${WrappedComponent.displayName})`;

  return wrapComponent;
}

export default withPromisePortal;
