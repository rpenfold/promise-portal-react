import { ComponentType } from "react";
import { PortalConfig, PromiseComponentResult } from "types";
import PromisePortalProvider, { singleton } from "./PromisePortalProvider";

export { default as ComponentRegistry } from "./ComponentRegistry";

export { default as usePromisePortal } from './usePromisePortal';

export { default as withPromisePortal } from './withPromisePortal';

export { default as PromisePortalProvider } from './PromisePortalProvider';

const promisePortal = {
  show: (component: ComponentType<unknown>, config: PortalConfig): Promise<PromiseComponentResult> =>
    singleton.show(component, config),
  Provider: PromisePortalProvider,
}

export default promisePortal;
