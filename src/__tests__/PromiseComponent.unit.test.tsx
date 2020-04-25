import React from "react";
import { shallow } from "enzyme";
import PromiseComponent,
    { Props as InternalPromiseComponentProps }
from "../PromiseComponent";

class MockComponent extends React.Component {}

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
    cancel: jest.fn(),
    complete: jest.fn(),
    onError: jest.fn(),
});

describe("<PromiseComponent/>", () => {
    const props = getProps();
    const wrapper = shallow(<PromiseComponent {...props}/>);

    it("does not render null", () => {
        expect(wrapper.isEmptyRender()).toBe(false);
    });
});
