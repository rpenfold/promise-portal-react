import { Portal } from "../types";


export type SetPortals = React.Dispatch<React.SetStateAction<Portal[]>>;

/**
 * Composes an updater for modifying provider state. The main purpose of this is to increase testability
 * by reducing requirements for inline anonymous functions.
 * 
 * To use, provide the `SetPortals` reference and specify an updater. As a convenience, it will also be
 * helpful to provide the typings expected by the updater using the generic `T`, where T is an array of
 * arguments that will be passed to the updater.
 */
export function composeUpdater<T extends Array<any>>(
  SetPortals: SetPortals,
  updater: (...params: Array<any>) => (portals: Array<Portal>) => Array<Portal>,
) {
  return (...args: T) => {
    SetPortals(updater(...args))
  }
}

/**
 * Updater for adding a portal to the top of the stack.
 */
export const addPortalUpdater = (portal: Portal) =>
  (portals: Array<Portal>) => [
    ...portals,
    portal,
  ];

/**
 * Updater for removing a portal from the stack by id.
 */
export const removePortalByIdUpdater = (id: string) =>
  (portals: Array<Portal>) =>
    portals.filter((portal) => portal.id !== id);

/**
 * Creates an updater that applies a specified change to a portal by id
 */
export const modifyPortalByIdUpdater = (changes: Partial<Portal>) =>
  (id: string) =>
    (portals: Array<Portal>) =>
      portals.map((portal) => (portal.id === id) ? { ...portal, ...changes } : portal);
