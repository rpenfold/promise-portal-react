import { ComponentType } from "react";

/**
 * ComponentRegistry is used for registering react components to
 * later display using a specified string rather than a component.
 * `PromisePortal.show()` accepts either a string or component as
 * the first parameter. If it is a string, then it will do a lookup
 * in ComponentRegistry to find the react component that was regist-
 * ered with that string.
 */
class ComponentRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static registry: Record<string, ComponentType<any>> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register(key: string, Component: ComponentType<any>): void {
    ComponentRegistry.registry[key] = Component;
  }

  static registerCollection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components: Record<string, ComponentType<any>>,
  ): void {
    ComponentRegistry.registry = Object.assign(
      ComponentRegistry.registry,
      components,
    );
  }

  static unregister(key: string): void {
    delete ComponentRegistry.registry[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static find(key: string): ComponentType<any> {
    return ComponentRegistry.registry[key];
  }

  static clear(): void {
    ComponentRegistry.registry = {};
  }

  static size(): number {
    return Object.keys(ComponentRegistry.registry).length;
  }
}

export default ComponentRegistry;
