import { ComponentType, ErrorInfo, ReactNode } from "react";

export interface PortalConfig {
  /** Whether to force the component to be shown even if it's not at the front of the queue */
  forceShow?: boolean;
  /** Props to inject into the promise component */
  props?: Record<string, unknown>;
}

export interface PromiseComponentResult {
  /** Whether the promise component was cancelled */
  cancelled: boolean;
  /** Data payload from the promise component */
  data?: unknown;
  /** Error caught by the promise component */
  error?: Error;
  /** Info related to an error caught by the promise component */
  errorInfo?: ErrorInfo;
}

export interface PromiseComponentProps {
  /** A convenience prop for triggering open/close animations */
  open: boolean;
  /** Cancels the promise component */
  cancel(data?: unknown): void;
  /** Completes the promise component. Data will be injected into the promise result */
  complete(data: unknown): void;
  /** Sets `open` to false to facilitate close animations */
  requestClose(): void;
}

export interface PromisePortalActions {
  show(component: ComponentType<unknown>, config: PortalConfig): Promise<PromiseComponentResult>;
  clear(): void;
}

export interface Portal<P = unknown> {
  /** An internal unique identifier for accessing the component */
  id: number;
  /** The React component to be rendered */
  Component: ComponentType<P & PromiseComponentProps>;
  /** Whether to force the component to be shown even if it's not at the front of the queue */
  forceShow?: boolean;
  /** A convenience prop for triggering open/close animations */
  open: boolean;
  /** Props to be passed down to component */
  props?: Record<string, unknown>;
  /** Callback for resolving the promise */
  onComplete(data: unknown): void;
  /** Callback for rejecting the promise */
  onCancel(data?: unknown): void;
  /** Callback for when an error is thrown in the component */
  onError(error: Error, errorInfo: ErrorInfo): void;
  /** Callback that sets `open` to false to facilitate close animations */
  onRequestClose(): void;
}

export interface PromisePortalProviderProps {
  children: ReactNode;
}
