import { Component } from "react";
import ComponentRegistry from "../ComponentRegistry";

const mockComponent1 = { key: "1", Component };
const mockComponent2 = { key: "2", Component };
const mockComponent3 = { key: "3", Component };

describe("ComponentRegistry", () => {
    beforeEach(() => {
        ComponentRegistry.clear();
    });

    describe("ComponentRegistry.register", () => {
        it("registers a single component", () => {
            ComponentRegistry.register(mockComponent1.key, mockComponent1.Component);
            expect(ComponentRegistry.find(mockComponent1.key)).toBeDefined();
        });
    });

    describe("ComponentRegistry.registerCollection", () => {
        it("registers a collection of components", () => {
            ComponentRegistry.registerCollection({
                [mockComponent1.key]: mockComponent1.Component,
                [mockComponent2.key]: mockComponent2.Component,
                [mockComponent3.key]: mockComponent3.Component,
            });
            expect(ComponentRegistry.find(mockComponent1.key)).toBeDefined();
            expect(ComponentRegistry.find(mockComponent2.key)).toBeDefined();
            expect(ComponentRegistry.find(mockComponent3.key)).toBeDefined();
        });
    });

    describe("ComponentRegistry.unregister", () => {
        const mockComponent = { key: "some_key", Component };
        it("unregisters component with the specified key", () => {
            ComponentRegistry.register(mockComponent.key, mockComponent.Component);
            expect(ComponentRegistry.find(mockComponent.key)).toBeDefined();
            ComponentRegistry.unregister(mockComponent.key);
            expect(ComponentRegistry.find(mockComponent.key)).toBeUndefined();
        });
    });

    describe("ComponentRegistry.find", () => {
        it("return component if it was registered", () => {
            ComponentRegistry.register(mockComponent1.key, mockComponent1.Component);
            expect(ComponentRegistry.find(mockComponent1.key)).toEqual(mockComponent1.Component);  
        });

        it("returns undefined if no component registered with the specified key", () => {
            expect(ComponentRegistry.find("invalid")).toBeUndefined();  
        });
    });

    describe("ComponentRegistry.clear", () => {        
        it("removes all registered components", () => {
            ComponentRegistry.registerCollection({
                [mockComponent1.key]: mockComponent1.Component,
                [mockComponent2.key]: mockComponent2.Component,
                [mockComponent3.key]: mockComponent3.Component,
            });

            expect(ComponentRegistry.size()).toEqual(3);
            ComponentRegistry.clear();
            expect(ComponentRegistry.size()).toEqual(0);
        });
    });

    describe("ComponentRegistry.size", () => {
        it("returns size of registry", () => {
            expect(ComponentRegistry.size()).toEqual(0);

            ComponentRegistry.register(mockComponent1.key, mockComponent1.Component);
            expect(ComponentRegistry.size()).toEqual(1);

            ComponentRegistry.register(mockComponent2.key, mockComponent2.Component);
            expect(ComponentRegistry.size()).toEqual(2);
        });
    });
});
