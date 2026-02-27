import { shallow } from "enzyme";
import React from "react";
import PromisePortalContext from "../PromisePortalContext";
import type { PromisePortalActions } from "../types";
import withPromisePortal from "../withPromisePortal";

interface MockComponentProp {
  someProp: string;
}

type MockFunction = () => void;

const WrappedComponent = withPromisePortal<MockComponentProp>(React.Component);

describe("withPromisePortal", () => {
  const mockContext: PromisePortalActions = {
    showPortal: jest.fn(),
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
