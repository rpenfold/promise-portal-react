import React from "react";
import checkIsClassComponent from "../checkIsClassComponent";

describe('checkIsClassComponent()', () => {
  it('true if class component provided', () => {
    class MockClassComponent extends React.Component {
      render() {
        return null;
      }
    }

    expect(checkIsClassComponent(MockClassComponent)).toBe(true);
  });

  it('false if functional component', () => {
    const MockFunctionalComponent = () => null;

    expect(checkIsClassComponent(MockFunctionalComponent)).toBe(false);
  });
});
