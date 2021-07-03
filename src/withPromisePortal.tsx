import React, { ComponentType, ReactNode } from "react";
import PromisePortalContext from "./PromisePortalContext";
import { PromisePortalActions } from "./types";

function withPromisePortal<PassedProps>(
  WrappedComponent: ComponentType<PassedProps & PromisePortalActions>
): ComponentType<PassedProps> {
  const wrapComponent: React.FC<PassedProps> = (props: PassedProps) => {
    return (
      <PromisePortalContext.Consumer>
        {(context: PromisePortalActions | null): ReactNode => (
          <WrappedComponent
            {...(props as PassedProps)}
            {...(context as PromisePortalActions)}
          />
        )}
      </PromisePortalContext.Consumer>
    );
  };

  wrapComponent.displayName = `WithPromisePortal(${WrappedComponent.displayName})`;

  return wrapComponent;
}

export default withPromisePortal;
