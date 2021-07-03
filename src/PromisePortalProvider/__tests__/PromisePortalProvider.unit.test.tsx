import React, { ErrorInfo } from "react";
import getMockPortal from "./mockPortal";
import { Portal } from "../../types";
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
  });
});
