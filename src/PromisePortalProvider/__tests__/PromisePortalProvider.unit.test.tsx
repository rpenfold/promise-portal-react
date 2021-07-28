import React, { ErrorInfo } from "react";
import getMockPortal from "./mockPortal";
import { Portal } from "../../types";
import { MatchPortalPredicate } from "../types";
import { clearPortals } from "../PromisePortalProvider";

describe("PromisePortalProvider", () => {
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
      console.debug("***", mockPortalA.Component.displayName)
      const mockPortals = [mockPortalA, mockPortalB];
      const mockPredicate: MatchPortalPredicate = (name) => name === "ComponentA";

      clearPortals(mockPortals)(mockPredicate);

      expect(mockPortalA.onCancel).toBeCalled();
      expect(mockPortalB.onCancel).not.toBeCalled();
    });
  });
});
