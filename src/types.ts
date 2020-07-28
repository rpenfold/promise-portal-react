import { ErrorInfo } from "react";

export interface PromiseComponentConfig {
    /** Whether to force display the promise component if it is not at bottom of stack */
    forceShow?: boolean;
    /** Props to inject into the promise component */
    props?: object;
}

export interface PromiseComponentProps {
    /** Cancels the promise component */
    cancel(): void;
    /** Completes the promise component. Data will be injected into the promise result */
    complete(data: object): void;
}

export interface PromiseComponentResult {
    /** Whether the promise component was cancelled */
    cancelled: boolean;
    /** Data payload from the promise component */
    data?: object;
    /** Error caught by the promise component */
    error?: Error;
    /** Info related to an error caught by the promise component */
    errorInfo?: ErrorInfo;
}

export type PromisePortalProps = null | {};
