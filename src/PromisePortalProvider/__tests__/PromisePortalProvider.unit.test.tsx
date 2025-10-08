import React from "react";
import { render, screen, act } from "@testing-library/react";
import getMockPortal from "./mockPortal";
import { Portal } from "../../types";
import { MatchPortalPredicate } from "../types";
import { clearPortals, PromisePortalProvider } from "../PromisePortalProvider";
import Dispatcher from "../../Dispatcher";
import ComponentRegistry from "../../ComponentRegistry";

class BaseMockComponent extends React.Component {
  render() {
    return null;
  }
}

describe("PromisePortalProvider", () => {
  beforeAll(() => {
    ComponentRegistry.register("some_component", BaseMockComponent);
  });

  afterAll(() => {
    ComponentRegistry.clear();
  });
  describe("<PromisePortalProvider />", () => {
    it("renders children", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      expect(screen.getByText("test")).toBeTruthy();
    });

    it("showPortalAsync returns a promise", async () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      await act(async () => {
        const result = Dispatcher.showPortalAsync(BaseMockComponent);
        expect(result).toBeInstanceOf(Promise);
      });
      await act(async () => {
        const result = Dispatcher.showPortalAsync("some_component");
        expect(result).toBeInstanceOf(Promise);
      });
    });

    it("showPortalAsync does not throw with props", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      expect(() => {
        act(() => {
          Dispatcher.showPortalAsync(BaseMockComponent, { someProp: "value" });
        });
      }).not.toThrow();
    });

    it("showPortalAsync does not throw with string component", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      expect(() => {
        act(() => {
          Dispatcher.showPortalAsync("some_component");
        });
      }).not.toThrow();
    });

    it("showPortal returns correct result shape", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      act(() => {
        const result = Dispatcher.showPortal(BaseMockComponent);
        expect(result).toHaveProperty("cancel");
        expect(result).toHaveProperty("requestClose");
        expect(result).toHaveProperty("ref");
        expect(typeof result.cancel).toBe("function");
        expect(typeof result.requestClose).toBe("function");
      });
      act(() => {
        const result = Dispatcher.showPortal(() => null);
        expect(result).toHaveProperty("cancel");
        expect(result).toHaveProperty("requestClose");
        expect(result).toHaveProperty("ref");
      });
      act(() => {
        const result = Dispatcher.showPortal("some_component");
        expect(result).toHaveProperty("cancel");
        expect(result).toHaveProperty("requestClose");
        expect(result).toHaveProperty("ref");
      });
    });

    it("showPortal result methods do not throw when called", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      act(() => {
        const result = Dispatcher.showPortal(BaseMockComponent);
        expect(() => result.cancel()).not.toThrow();
        expect(() => result.requestClose()).not.toThrow();
      });
    });

    it("showPortal does not throw with props", () => {
      render(
        <PromisePortalProvider>
          <div>test</div>
        </PromisePortalProvider>,
      );
      expect(() => {
        act(() => {
          Dispatcher.showPortal(BaseMockComponent, { someProp: "value" });
        });
      }).not.toThrow();
    });
  });

  describe("clearPortals()", () => {
    it("cancels each individual component", () => {
      const mockPortals = [getMockPortal("1"), getMockPortal("2")];
      clearPortals(mockPortals)();

      mockPortals.forEach((portal: Portal) =>
        expect(portal.onCancel).toHaveBeenCalled(),
      );
    });

    it("cancels only portals that match the predicate if provided", () => {
      const mockPortalA = getMockPortal("1", "ComponentA");
      const mockPortalB = getMockPortal("2", "ComponentB");
      const mockPortals = [mockPortalA, mockPortalB];
      const mockPredicate: MatchPortalPredicate = (name) =>
        name === "ComponentA";

      clearPortals(mockPortals)(mockPredicate);

      expect(mockPortalA.onCancel).toHaveBeenCalled();
      expect(mockPortalB.onCancel).not.toHaveBeenCalled();
    });
  });
});
