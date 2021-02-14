import PromisePortalProvider, { singleton } from "./PromisePortalProvider";

export { default as ComponentRegistry } from "./ComponentRegistry";

export { default as usePromisePortal } from './usePromisePortal';

export { PromisePortalProvider };

const promisePortal = {
    show: singleton.show,
}

export default promisePortal;
