import { ReactType } from "react";

class ComponentRegistry {
    private static registry: Record<string, ReactType> = {};

    static register(key: string, Component: ReactType): void {
        ComponentRegistry.registry[key] = Component;
    }

    static registerCollection(components: Record<string, ReactType>): void {
        ComponentRegistry.registry = Object.assign(ComponentRegistry.registry, components);
    }

    static unregister(key: string): void {
        delete ComponentRegistry.registry[key];
    }

    static find(key: string): ReactType {
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
