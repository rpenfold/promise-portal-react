export interface PromiseComponentConfig {
    forceShow?: boolean;
    props?: object;
}

export interface PromiseComponentProps {
    cancel(): void;
    complete(data: object): void;
}

export interface PromiseComponentResult {
    cancelled: boolean;
    data: object;
}
