import { ReactType } from "react";

class ComponentRegistry {
    private static registry: Record<string, ReactType>;

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
}

export default ComponentRegistry;
