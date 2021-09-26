import React, { ComponentType, ReactNode } from "react";
import getComponentName from "./utils/getComponentName";
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

  const displayName = getComponentName(WrappedComponent);
  wrapComponent.displayName = `WithPromisePortal(${displayName})`;

  return wrapComponent;
}

export default withPromisePortal;
