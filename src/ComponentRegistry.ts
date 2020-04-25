import { ReactType } from "react";

class ComponentRegistry {
    private static registry: Record<string, ReactType> = {};

    static register(key: string, Component: ReactType) {
        ComponentRegistry.registry[key] = Component;
    }

    static registerCollection(components: Record<string, ReactType>) {
        ComponentRegistry.registry = Object.assign(ComponentRegistry.registry, components);
    }

    static unregister(key: string) {
        delete ComponentRegistry.registry[key];
    }

    static find(key: string): ReactType {
        return ComponentRegistry.registry[key];
    }

    static clear() {
        ComponentRegistry.registry = {};
    }

    static size() {
        return Object.keys(ComponentRegistry.registry).length;
    }
}

export default ComponentRegistry;
