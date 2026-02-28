import { shallow } from "enzyme";
import React from "react";
import Dispatcher from "../Dispatcher";
import type { DispatcherProps } from "../types";

const makeProps = (providerKey = "default"): DispatcherProps => ({
  clear: jest.fn(),
  showPortal: jest.fn(),
  showPortalAsync: jest.fn(),
  providerKey,
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
      expect(props.showPortalAsync).toHaveBeenCalledWith(
        component,
        portalProps,
      );
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
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>.",
      );
    });

    it("showPortalAsync throws a clear error", async () => {
      wrapper!.unmount();
      wrapper = null;
      await expect(Dispatcher.showPortalAsync(React.Component)).rejects.toThrow(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>.",
      );
    });

    it("clear throws a clear error", () => {
      wrapper!.unmount();
      wrapper = null;
      expect(() => Dispatcher.clear()).toThrow(
        "PromisePortal: no provider mounted. Wrap your app in <PromisePortalProvider>.",
      );
    });
  });

  describe("unmounting", () => {
    it("restores the previous instance when the current instance unmounts", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("a");
      const propsB = makeProps("b");
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

      const propsA = makeProps("a");
      const propsB = makeProps("b");
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

  describe("non-LIFO unmount", () => {
    it("current is the last remaining instance when middle provider unmounts", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("a");
      const propsB = makeProps("b");
      const propsC = makeProps("c");
      const wrapperA = shallow(<Dispatcher {...propsA} />);
      const wrapperB = shallow(<Dispatcher {...propsB} />);
      const wrapperC = shallow(<Dispatcher {...propsC} />);

      Dispatcher.showPortal(React.Component);
      expect(propsC.showPortal).toHaveBeenCalledTimes(1);
      expect(propsA.showPortal).not.toHaveBeenCalled();
      expect(propsB.showPortal).not.toHaveBeenCalled();

      wrapperB.unmount();

      Dispatcher.showPortal(React.Component);
      expect(propsC.showPortal).toHaveBeenCalledTimes(2);
      expect(propsA.showPortal).not.toHaveBeenCalled();
      expect(propsB.showPortal).not.toHaveBeenCalled();

      wrapperC.unmount();

      Dispatcher.showPortal(React.Component);
      expect(propsA.showPortal).toHaveBeenCalledTimes(1);
      expect(propsC.showPortal).toHaveBeenCalledTimes(2);

      wrapperA.unmount();
    });
  });

  describe("targeted dispatch by providerKey", () => {
    it("dispatches to the provider with the given key", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("modal-root");
      const propsB = makeProps("toast-root");
      shallow(<Dispatcher {...propsA} />);
      shallow(<Dispatcher {...propsB} />);

      Dispatcher.showPortal(React.Component, undefined, {
        providerKey: "modal-root",
      });
      expect(propsA.showPortal).toHaveBeenCalledTimes(1);
      expect(propsB.showPortal).not.toHaveBeenCalled();

      Dispatcher.showPortal(React.Component, undefined, {
        providerKey: "toast-root",
      });
      expect(propsA.showPortal).toHaveBeenCalledTimes(1);
      expect(propsB.showPortal).toHaveBeenCalledTimes(1);
    });

    it("showPortalAsync with providerKey targets the correct provider", async () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("a");
      const propsB = makeProps("b");
      shallow(<Dispatcher {...propsA} />);
      shallow(<Dispatcher {...propsB} />);

      await Dispatcher.showPortalAsync(
        React.Component,
        {},
        { providerKey: "a" },
      );
      expect(propsA.showPortalAsync).toHaveBeenCalledTimes(1);
      expect(propsB.showPortalAsync).not.toHaveBeenCalled();
    });

    it("clear with providerKey targets the correct provider", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("a");
      const propsB = makeProps("b");
      shallow(<Dispatcher {...propsA} />);
      shallow(<Dispatcher {...propsB} />);

      const predicate = jest.fn();
      Dispatcher.clear(predicate, { providerKey: "b" });
      expect(propsB.clear).toHaveBeenCalledWith(predicate);
      expect(propsA.clear).not.toHaveBeenCalled();
    });

    it("throws when providerKey does not exist", () => {
      expect(() =>
        Dispatcher.showPortal(React.Component, undefined, {
          providerKey: "nonexistent",
        }),
      ).toThrow('PromisePortal: no provider mounted for key "nonexistent".');
    });

    it("throws when providerKey refers to an unmounted provider", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("a");
      const wrapperA = shallow(<Dispatcher {...propsA} />);
      wrapperA.unmount();

      expect(() =>
        Dispatcher.showPortal(React.Component, undefined, { providerKey: "a" }),
      ).toThrow('PromisePortal: no provider mounted for key "a".');
    });

    it("throws when providerKey is in registry but instance was removed from list", () => {
      wrapper!.unmount();
      wrapper = null;

      const propsA = makeProps("stale-key");
      const wrapperA = shallow(<Dispatcher {...propsA} />);
      const instance = wrapperA.instance() as InstanceType<typeof Dispatcher>;
      const DispatcherClass = Dispatcher as unknown as {
        instances: InstanceType<typeof Dispatcher>[];
        registry: Map<string, InstanceType<typeof Dispatcher>>;
      };
      DispatcherClass.instances = DispatcherClass.instances.filter(
        (d) => d !== instance,
      );

      expect(() =>
        Dispatcher.showPortal(React.Component, undefined, {
          providerKey: "stale-key",
        }),
      ).toThrow(
        'PromisePortal: provider for key "stale-key" is no longer mounted.',
      );

      wrapperA.unmount();
    });
  });
});
