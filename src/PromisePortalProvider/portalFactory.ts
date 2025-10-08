import { ErrorInfo, RefObject } from "react";
import {
  ComponentProps,
  Portal,
  PortalComponentType,
  PromiseComponentResult,
} from "types";
import generateSimpleUniqueId from "../utils/simpleUniqueId";
import { ProviderInternalContext } from "./types";

/**
 * Builds a portal that can be awaited.
 */
export const buildAwaitablePortal =
  <T>(
    resolve: (
      value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>,
    ) => void,
    reject: (
      value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>,
    ) => void,
  ) =>
  (
    Component: PortalComponentType,
    props: ComponentProps,
    context: ProviderInternalContext,
  ): Portal<T> => {
    const id = (props.key as string) ?? generateSimpleUniqueId();
    return {
      id,
      Component,
      open: true,
      props,
      forceShow: true,
      onCancel: (data?: T): void => {
        resolve({ cancelled: true, data });
        context.removePortal(id);
      },
      onComplete: (data?: T): void => {
        resolve({ cancelled: false, data });
        context.removePortal(id);
      },
      onError: (error: Error, errorInfo: ErrorInfo): void => {
        reject({ cancelled: false, error, errorInfo });
        context.removePortal(id);
      },
      onRequestClose: (): void => context.requestClosePortal(id),
    };
  };

export const buildPortal =
  (forwardRef: RefObject<unknown> | null) =>
  <P extends ComponentProps>(
    Component: PortalComponentType,
    props: P | undefined,
    context: ProviderInternalContext,
  ): Portal => {
    const id =
      (((props || {}) as Record<string, unknown>).key as string) ??
      generateSimpleUniqueId();
    return {
      id,
      Component,
      open: true,
      props: (props || {}) as ComponentProps,
      forceShow: true,
      forwardRef,
      onCancel: (): void => {
        context.removePortal(id);
      },
      onComplete: (): void => {
        context.removePortal(id);
      },
      onError: (error: Error): void => {
        context.removePortal(id);
        throw error;
      },
      onRequestClose: (): void => context.requestClosePortal(id),
    };
  };
