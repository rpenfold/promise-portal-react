import React from "react";
import { shallow } from "enzyme";
import Dispatcher from "../Dispatcher";
import { PromisePortalActions } from "../types";

describe("<Dispatcher />", () => {
  const props: PromisePortalActions = {
    clear: jest.fn(),
    showPortal: jest.fn(),
    showPortalAsync: jest.fn(),
  };

  // mount the singleton instance
  shallow(<Dispatcher {...props} />);

  describe("Dispatcher.showPortalAsync()", () => {
    it('invokes "showPortalAsync" on the singleton instance', async () => {
      await Dispatcher.showPortalAsync(React.Component);
      expect(props.showPortalAsync).toBeCalled();
    });
  });

  describe("Dispatcher.showPortal()", () => {
    it('invokes "showPortalAsync" on the singleton instance', async () => {
      await Dispatcher.showPortal(React.Component);
      expect(props.showPortal).toBeCalled();
    });
  });

  describe("Dispatcher.clear()", () => {
    it('invokes "clear" on the singleton instance', () => {
      Dispatcher.clear();
      expect(props.clear).toBeCalled();
    });
  });
});
