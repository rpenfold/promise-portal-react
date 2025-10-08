import { ComponentType } from "react";

export default function getComponentName(
  Component: ComponentType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): string {
  return Component.displayName ?? Component.name ?? "Component";
}
