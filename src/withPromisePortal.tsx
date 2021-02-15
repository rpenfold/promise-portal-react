import React, { ComponentType, ReactNode } from 'react';
import PromisePortalContext from './PromisePortalContext';
import { PromisePortalActions } from './types';

interface Props {
  promisePortal: PromisePortalActions;
}

// TODO: figure out how to disallow null for context
function withPromisePortal<P extends Props>(WrappedComponent: ComponentType<P>): ReactNode {
  function wrapComponent(props: P): ReactNode {
    return (
      <PromisePortalContext.Consumer>
        {(context: PromisePortalActions | null): ReactNode =>
          <WrappedComponent {...props} promisePortal={context as PromisePortalActions} />
        }
      </PromisePortalContext.Consumer>
    );
  }

  wrapComponent.displayName = `WithPromisePortal(${WrappedComponent.displayName})`;

  return wrapComponent
}

export default withPromisePortal;
