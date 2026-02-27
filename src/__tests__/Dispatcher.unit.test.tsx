import React from "react";
import { shallow } from "enzyme";
import Dispatcher from "../Dispatcher";
import { PromisePortalActions } from "../types";

const makeProps = (): PromisePortalActions => ({
  clear: jest.fn(),
  showPortal: jest.fn(),
  showPortalAsync: jest.fn(),
});

describe("<Dispatcher />", () => {
  const props = makeProps();
  let wrapper: ReturnType<typeof shallow> | null = null;

  beforeEach(() => {
    wrapper = shallow(<Dispatcher {...props} />);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  describe("Dispatcher.showPortalAsync()", () => {
    it("invokes showPortalAsync on the singleton instance", async () => {
      await Dispatcher.showPortalAsync(React.Component);
      expect(props.showPortalAsync).toHaveBeenCalled();
    });

    it("forwards component and props to the instance", async () => {
      const component = React.Component;
      const portalProps = { foo: "bar" };
      await Dispatcher.showPortalAsync(component, portalProps);
      expect(props.showPortalAsync).toHaveBeenCalledWith(component, portalProps);
    });
  });

  describe("Dispatcher.showPortal()", () => {
    it("invokes showPortal on the singleton instance", () => {
      Dispatcher.showPortal(React.Component);
      expect(props.showPortal).toHaveBeenCalled();
    });

    it("forwards component and props to the instance", () => {
      const component = React.Component;
      const portalProps = { foo: "bar" };
      Dispatcher.showPortal(component, portalProps);
      expect(props.showPortal).toHaveBeenCalledWith(component, portalProps);
    });
  });

  describe("Dispatcher.clear()", () => {
    it("invokes clear on the singleton instance", () => {
      Dispatcher.clear();
      expect(props.clear).toHaveBeenCalled();
    });

    it("forwards optional predicate to the instance", () => {
      const predicate = jest.fn();
      Dispatcher.clear(predicate);
      expect(props.clear).toHaveBeenCalledWith(predicate);
    });
  });

  describe("when no provider is mounted", () => {
    it("showPortal throws a clear error", () => {
      wrapper!.unmount();
      wrapper = null;
      expect(() => Dispatcher.showPortal(React.Component)).toThrow(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>."
      );
    });

    it("showPortalAsync throws a clear error", async () => {
      wrapper!.unmount();
      wrapper = null;
      await expect(Dispatcher.showPortalAsync(React.Component)).rejects.toThrow(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>."
      );
    });

    it("clear throws a clear error", () => {
      wrapper!.unmount();
      wrapper = null;
      expect(() => Dispatcher.clear()).toThrow(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>."
      );
    });
  });

  describe("unmounting", () => {
    it("restores the previous instance when the current instance unmounts", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps();
      const propsB = makeProps();
      const wrapperA = shallow(<Dispatcher {...propsA} />);
      const wrapperB = shallow(<Dispatcher {...propsB} />);

      Dispatcher.showPortal(React.Component);
      expect(propsB.showPortal).toHaveBeenCalledTimes(1);
      expect(propsA.showPortal).not.toHaveBeenCalled();

      wrapperB.unmount();

      Dispatcher.showPortal(React.Component);
      expect(propsA.showPortal).toHaveBeenCalledTimes(1);
      expect(propsB.showPortal).toHaveBeenCalledTimes(1);

      wrapperA.unmount();
    });

    it("does not restore when unmounting a non-current instance", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps();
      const propsB = makeProps();
      const wrapperA = shallow(<Dispatcher {...propsA} />);
      const wrapperB = shallow(<Dispatcher {...propsB} />);

      wrapperA.unmount();

      Dispatcher.showPortal(React.Component);
      expect(propsB.showPortal).toHaveBeenCalledTimes(1);
      expect(propsA.showPortal).not.toHaveBeenCalled();

      wrapperB.unmount();
    });
  });

  describe("render()", () => {
    it("returns null", () => {
      expect(wrapper!.isEmptyRender()).toBe(true);
    });
  });
});
