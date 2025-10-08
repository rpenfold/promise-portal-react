import React from "react";
import Dispatcher from "../Dispatcher";
import { PromisePortalActions } from "../types";
import { render } from "@testing-library/react";

describe("<Dispatcher />", () => {
  const props: PromisePortalActions = {
    clear: jest.fn(),
    showPortal: jest.fn(),
    showPortalAsync: jest.fn(),
  };

  // mount the singleton instance
  render(<Dispatcher {...props} />);

  describe("Dispatcher.showPortalAsync()", () => {
    it('invokes "showPortalAsync" on the singleton instance', async () => {
      await Dispatcher.showPortalAsync(React.Component);
      expect(props.showPortalAsync).toHaveBeenCalled();
    });
  });

  describe("Dispatcher.showPortal()", () => {
    it('invokes "showPortalAsync" on the singleton instance', async () => {
      await Dispatcher.showPortal(React.Component);
      expect(props.showPortal).toHaveBeenCalled();
    });
  });

  describe("Dispatcher.clear()", () => {
    it('invokes "clear" on the singleton instance', () => {
      Dispatcher.clear();
      expect(props.clear).toHaveBeenCalled();
    });
  });
});
