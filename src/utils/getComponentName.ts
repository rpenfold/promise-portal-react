import type { ComponentType } from "react";

export default function getComponentName(
  // biome-ignore lint/suspicious/noExplicitAny: generic component type for display name resolution
  Component: ComponentType<any>,
): string {
  return Component.displayName ?? Component.name ?? "Component";
}
