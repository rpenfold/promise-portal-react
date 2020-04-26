import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ComponentRegistry from "../ComponentRegistry";
import PromisePortal, {
    PromisePortalComponent
} from "../PromisePortal";

jest.mock("../ComponentRegistry");
const mockComponentRegistry = ComponentRegistry as jest.Mocked<typeof ComponentRegistry>;

const mockComponentKey = "myComponent";
const getMockComponentInfo = (): PromisePortalComponent => ({
    Component: React.Component,
    promiseInfo: {
        resolve: jest.fn(),
        reject: jest.fn(),
    }
});

describe("<PromisePortal/>", () => {
    let wrapper: ShallowWrapper<PromisePortal>;
    let instance: PromisePortal;

    beforeEach(() => {
        wrapper = shallow(
            <PromisePortal/>,
            { disableLifecycleMethods: true }
        );
        instance = wrapper.instance() as PromisePortal;
    });

    describe("instance.handleCancel", () => {
        it("resolves promise with result.cancelled being true", () => {
            const component = getMockComponentInfo();
            instance.pushComponent(mockComponentKey, component);
            instance.handleCancel(mockComponentKey);
            expect(component.promiseInfo.resolve).toBeCalledWith({ cancelled: true });
        });
    });

    describe("instance.handleComplete", () => {
        it("resolves promise with correct result", () => {
            const component = getMockComponentInfo();
            const mockData = { val: 1 };
            instance.pushComponent(mockComponentKey, component);
            instance.handleComplete(mockComponentKey, mockData);
            expect(component.promiseInfo.resolve).toBeCalledWith({
                cancelled: false,
                data: mockData
            });
        });
    });

    describe("instance.handleError", () => {
        it("rejects promise", () => {
            const component = getMockComponentInfo();
            const mockError = new Error("some_error");
            const mockErrorInfo = { componentStack: "" };
            instance.pushComponent(mockComponentKey, component);
            instance.handleError(mockComponentKey, mockError, mockErrorInfo);
            expect(component.promiseInfo.reject).toBeCalledWith({
                cancelled: false,
                error: mockError,
                errorInfo: mockErrorInfo
            });
        });
    });

    describe("instance.pushComponent", () => {
        it("pushes component onto stack", () => {
            const component = getMockComponentInfo();
            instance.pushComponent(mockComponentKey, component);
            expect(instance.state.componentKeys).toEqual([mockComponentKey]);
        });
    });

    describe("instance.removeComponent", () => {
        it("removes component from stack", () => {
            const component = getMockComponentInfo();
            instance.pushComponent(mockComponentKey, component);
            instance.removeComponent(mockComponentKey);
            expect(instance.state.componentKeys).toEqual([]);
        });
    });

    describe("PromisePortal.show", () => {
        it("throws error if no PromisePortal mounted", () => {
            PromisePortal.instance = undefined;
            expect(() => PromisePortal.show(React.Component)).toThrowError();
        });

        it("throws error if no component", () => {
            expect(() => PromisePortal.show("invalid")).toThrowError();
        });

        it("returns a promise when showing a component", () => {
            expect(PromisePortal.show(React.Component).then).toBeDefined();
        });

        it("returns a promise when showing a registered component", () => {
            mockComponentRegistry.find.mockReturnValueOnce(React.Component);
            expect(PromisePortal.show("myComponent").then).toBeDefined();
        });
    });
});
