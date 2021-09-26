import { PortalComponentType } from "types";

export default function getComponentName(Component: PortalComponentType): string {
  if (typeof Component === 'string') {
    return Component;
  }

  return Component.displayName ?? Component.name ?? "Component";
}