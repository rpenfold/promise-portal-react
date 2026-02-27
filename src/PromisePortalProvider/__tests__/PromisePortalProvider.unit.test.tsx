import { shallow } from "enzyme";
import React from "react";
import { withPromisePortal } from "../..";
import type { Portal, PromisePortalActions } from "../../types";
import { clearPortals, PromisePortalProvider } from "../PromisePortalProvider";
import type { MatchPortalPredicate } from "../types";
import getMockPortal from "./mockPortal";

class BaseMockComponent extends React.Component {}
// biome-ignore lint/suspicious/noExplicitAny: mock HOC accepts any props
const MockComponent = withPromisePortal<any>(BaseMockComponent);

describe("PromisePortalProvider", () => {
  describe("<PromisePortalProvider />", () => {
    const wrapper = shallow(
      <PromisePortalProvider>
        <MockComponent />
      </PromisePortalProvider>,
    );
    const accessor = wrapper.dive().at(0).dive().dive();
    const { showPortal, showPortalAsync } =
      accessor.props() as PromisePortalActions;

    it("showPortalAsync does not throw an error", () => {
      expect(() => showPortalAsync(BaseMockComponent)).not.toThrowError();
      expect(() => showPortalAsync("some_component")).not.toThrowError();
    });

    it("showPortal does not throw an error", () => {
      expect(() => showPortal(BaseMockComponent)).not.toThrowError();
      expect(() => showPortal(() => null)).not.toThrowError();
      expect(() => showPortal("some_component")).not.toThrowError();
    });
  });

  describe("clearPortals()", () => {
    it("cancels each individual component", () => {
      const mockPortals = [getMockPortal("1"), getMockPortal("2")];
      clearPortals(mockPortals)();

      mockPortals.forEach((portal: Portal) => {
        expect(portal.onCancel).toBeCalled();
      });
    });

    it("cancels only portals that match the predicate if provided", () => {
      const mockPortalA = getMockPortal("1", "ComponentA");
      const mockPortalB = getMockPortal("2", "ComponentB");
      const mockPortals = [mockPortalA, mockPortalB];
      const mockPredicate: MatchPortalPredicate = (name) =>
        name === "ComponentA";

      clearPortals(mockPortals)(mockPredicate);

      expect(mockPortalA.onCancel).toBeCalled();
      expect(mockPortalB.onCancel).not.toBeCalled();
    });
  });
});
