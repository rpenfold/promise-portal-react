import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import PromiseComponent,
    { Props as InternalPromiseComponentProps }
from "../PromiseComponent";

class MockComponent extends React.Component {}
type Wrapper = ShallowWrapper<InternalPromiseComponentProps, null, PromiseComponent>

const getProps = ({
    index = 0,
    data = {}
} = {}): InternalPromiseComponentProps => ({
    componentKey: "some_component_key",
    data: {
        Component: MockComponent,
        promiseInfo: {
            reject: jest.fn(),
            resolve: jest.fn(),
        },
        ...data
    },
    index,
    onCancel: jest.fn(),
    onComplete: jest.fn(),
    onError: jest.fn(),
});

describe("<PromiseComponent/>", () => {
    let props: InternalPromiseComponentProps;
    let wrapper: Wrapper;

    beforeEach(() => {
        props = getProps();
        wrapper = shallow(<PromiseComponent {...props}/>);
    });

    describe("render", () => {
        it("does not render null", () => {
            expect(wrapper.isEmptyRender()).toBe(false);
        });

        it("renders nothing if not at bottom of stack", () => {
            wrapper.setProps({ index: 1 });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        it("renders nothing if there was an error", () => {
            wrapper.setState({ hasErrors: true });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        it("renders if not at the bottom of the stack but is force shown", () => {
            props = getProps({ index: 1, data: { forceShow: true } })
            wrapper.setProps(props);
            expect(wrapper.isEmptyRender()).toBe(false);
        });
    });

    describe("instance.componentDidCatch", () => {
        it("invokes onError callback", () => {
            const error = new Error("mock_error");
            wrapper.simulateError(error);
            expect(props.onError).toBeCalledWith(props.componentKey, error, expect.anything())
        });

        it("sets state.hasErrors to be true", () => {
            wrapper.simulateError(new Error());
            expect(wrapper.state('hasErrors')).toBe(true);
        });

        it("does not render after error is caught", () => {
            wrapper.simulateError(new Error());
            expect(wrapper.isEmptyRender()).toBe(true);
        })
    });

    describe("instance.handleCancel", () => {
        it("invokes onCancel callback", () => {
            wrapper.instance().handleCancel();
            expect(props.onCancel).toBeCalledWith(props.componentKey);
        });
    });

    describe("instance.handleComplete", () => {
        it("invokes onComplete callback", () => {
            wrapper.instance().handleComplete();
            expect(props.onComplete).toBeCalledWith(props.componentKey, props.data);
        });
    });
});
