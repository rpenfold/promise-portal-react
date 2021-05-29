import PromisePortalProvider from "./PromisePortalProvider";
import Dispatcher from "./Dispatcher";

export { default as ComponentRegistry } from "./ComponentRegistry";

export { default as usePromisePortal } from "./usePromisePortal";

export { default as withPromisePortal } from "./withPromisePortal";

const promisePortal = {
  showPortalAsync: Dispatcher.showPortalAsync,
  Provider: PromisePortalProvider,
};

export default promisePortal;
