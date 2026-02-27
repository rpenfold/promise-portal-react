import React, { type ComponentType } from "react";
import getComponentName from "../getComponentName";

describe("getComponentName()", () => {
  const mockComponentName = "MyComponent";

  it("gets displayName if available", () => {
    class MockComponent extends React.Component {
      static displayName = mockComponentName;
    }

    expect(getComponentName(MockComponent)).toEqual(mockComponentName);
  });

  it("gets name if available", () => {
    function MyComponent() {
      return <React.Fragment />;
    }

    expect(getComponentName(MyComponent)).toEqual(mockComponentName);
  });

  it('falls back to "Component" if no other component name found', () => {
    expect(getComponentName({} as ComponentType)).toEqual("Component");
  });
});
