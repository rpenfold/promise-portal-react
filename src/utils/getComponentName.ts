import { ComponentType } from "react";

export default function getComponentName(Component: ComponentType<any>): string { // eslint-disable-line @typescript-eslint/no-explicit-any
    return Component.displayName ?? Component.name ?? "Component";
}