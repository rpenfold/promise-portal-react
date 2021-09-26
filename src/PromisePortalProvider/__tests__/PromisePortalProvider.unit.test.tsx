import React from "react";
import { shallow } from "enzyme";
import getMockPortal from "./mockPortal";
import { withPromisePortal } from "../..";
import { Portal, PromisePortalActions } from "../../types";
import { MatchPortalPredicate } from "../types";
import { clearPortals, PromisePortalProvider } from "../PromisePortalProvider";

class BaseMockComponent extends React.Component {}
const MockComponent = withPromisePortal<any>(BaseMockComponent); // eslint-disable-line @typescript-eslint/no-explicit-any

describe("PromisePortalProvider", () => {
  describe("<PromisePortalProvider />", () => {
    const wrapper = shallow(
      <PromisePortalProvider>
        <MockComponent />
      </PromisePortalProvider>
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
      expect(() => showPortal("some_component")).not.toThrowError();
    });
  });

  describe("clearPortals()", () => {
    it("cancels each individual component", () => {
      const mockPortals = [getMockPortal("1"), getMockPortal("2")];
      clearPortals(mockPortals)();

      mockPortals.forEach((portal: Portal) =>
        expect(portal.onCancel).toBeCalled()
      );
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
