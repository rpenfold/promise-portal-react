import React from "react";
import { shallow } from "enzyme";
import PromisePortalContext from "../PromisePortalContext";
import withPromisePortal from "../withPromisePortal";
import { PromisePortalActions } from "../types";

interface MockComponentProp {
  someProp: string;
}

type MockFunction = () => void;

const WrappedComponent = withPromisePortal<MockComponentProp>(React.Component);

describe("withPromisePortal", () => {
  const mockContext: PromisePortalActions = {
    showPortalAsync: jest.fn(),
    clear: jest.fn(),
  };

  const Contextualized = () => (
    <PromisePortalContext.Provider value={mockContext}>
      <WrappedComponent someProp="hello" />
    </PromisePortalContext.Provider>
  );

  const contextWrapper = shallow(<Contextualized />);
  const wrapper = contextWrapper.dive().dive().dive();

  it("passes props to wrapped component", () => {
    expect(wrapper.prop("someProp")).toEqual("hello");
  });

  it("promise portal actions are injected into wrapped component", () => {
    const showPortalAsync = wrapper.prop("showPortalAsync") as MockFunction;
    showPortalAsync();
    expect(mockContext.showPortalAsync).toBeCalled();
  });
});
