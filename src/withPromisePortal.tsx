// biome-ignore lint/style/useImportType: React must be value import for JSX
import React, { type ComponentType, type ReactNode } from "react";
import PromisePortalContext from "./PromisePortalContext";
import type { PromisePortalActions } from "./types";
import getComponentName from "./utils/getComponentName";

function withPromisePortal<PassedProps>(
  WrappedComponent: ComponentType<PassedProps & PromisePortalActions>,
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
