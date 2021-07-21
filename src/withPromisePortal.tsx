import React, { ComponentType, ReactNode } from "react";
import PromisePortalContext from "./PromisePortalContext";
import { PromisePortalActions } from "./types";

function withPromisePortal<PassedProps>(
  WrappedComponent: ComponentType<PassedProps>
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

  const name = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  wrapComponent.displayName = `WithPromisePortal(${name})`;

  return wrapComponent;
}

export default withPromisePortal;
