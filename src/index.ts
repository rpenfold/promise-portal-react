import PromisePortalProvider from "./PromisePortalProvider";
import Dispatcher from "./Dispatcher";

export {
  ComponentParam,
  ComponentProps,
  PromiseComponentProps,
  PromiseComponentResult,
  PromisePortalActions,
} from "./types";

export { default as ComponentRegistry } from "./ComponentRegistry";

export { default as usePromisePortal } from "./usePromisePortal";

export { default as withPromisePortal } from "./withPromisePortal";

export { default as Portal } from "./Portal";

const promisePortal = {
  clear: Dispatcher.clear,
  showPortal: Dispatcher.showPortal,
  showPortalAsync: Dispatcher.showPortalAsync,
  Provider: PromisePortalProvider,
};

export default promisePortal;
