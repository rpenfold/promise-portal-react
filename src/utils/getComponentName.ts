import { ComponentType } from "react";

export default function getComponentName(Component: ComponentType<any>) {
    return Component.displayName ?? Component.name ?? "Component";
}