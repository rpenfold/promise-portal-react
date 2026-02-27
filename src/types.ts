import type { ComponentType, ErrorInfo, ReactNode, RefObject } from "react";
import type { MatchPortalPredicate } from "./PromisePortalProvider/types";

export type ComponentParam = ComponentType<unknown> | ReactNode | string;

export type ComponentProps = Record<string, unknown> | undefined;

export type PortalComponentType = ComponentType<
  PromiseComponentProps & ComponentProps
>;

export interface PromiseComponentResult<T = Record<string, unknown>> {
  /** Whether the promise component was cancelled */
  cancelled: boolean;
  /** Data payload from the promise component */
  data?: T;
  /** Error caught by the promise component */
  error?: Error;
  /** Info related to an error caught by the promise component */
  errorInfo?: ErrorInfo;
}

export interface PromiseComponentProps<T = unknown> {
  /** A convenience prop for triggering open/close animations */
  open: boolean;
  /** Cancels the promise component */
  cancel(data?: T): void;
  /** Completes the promise component. Data will be injected into the promise result */
  complete(data: T): void;
  /** Sets `open` to false to facilitate close animations */
  requestClose(): void;
}

export interface ShowPortalResult {
  ref: RefObject<unknown> | null;
  cancel(): void;
  requestClose(): void;
}

export interface PromisePortalActions {
  showPortal(
    component: ComponentParam,
    props?: ComponentProps,
  ): ShowPortalResult;
  showPortalAsync<T = unknown>(
    component: ComponentParam,
    props?: ComponentProps,
  ): Promise<PromiseComponentResult<T>>;
  clear(predicate?: MatchPortalPredicate): void;
}

export interface Portal<T = unknown> {
  /**
   * An internal unique identifier for accessing the component. Uses a unique string id rather
   * than an incrementing count-based id solely for convenience of generating portal id outside
   * of React component.
   * */
  id: string;
  /** The React component to be rendered */
  Component: PortalComponentType;
  /** Whether to force the component to be shown even if it's not at the front of the queue */
  forceShow?: boolean;
  /** Forward ref to expose inner component to caller when using synchronously */
  forwardRef?: RefObject<unknown> | null;
  /** A convenience prop for triggering open/close animations */
  open: boolean;
  /** Props to be passed down to component */
  props?: ComponentProps;
  /** Callback for resolving the promise */
  onComplete(data?: T): void;
  /** Callback for rejecting the promise */
  onCancel(data?: T): void;
  /** Callback for when an error is thrown in the component */
  onError(error: Error, errorInfo: ErrorInfo): void;
  /** Callback that sets `open` to false to facilitate close animations */
  onRequestClose(): void;
}

export interface PromisePortalProviderProps {
  children: ReactNode;
}
