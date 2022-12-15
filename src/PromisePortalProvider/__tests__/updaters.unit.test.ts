import { Portal } from "../../types";
import getMockPortal from "./mockPortal";
import {
  addPortalUpdater,
  composeUpdater,
  removePortalByIdUpdater,
  modifyPortalByIdUpdater,
} from "../updaters";

describe("PromisePortalProvider.updaters", () => {
  const mockPortals = [getMockPortal("1"), getMockPortal("2")];

  describe("composeUpdaters()", () => {
    it("works correctly", () => {
      const mockSetComponents = jest.fn(() => mockPortals);
      const mockUpdater = jest
        .fn()
        .mockReturnValue((portals: Array<Portal>) => portals);
      const composed = composeUpdater(mockSetComponents, mockUpdater);

      composed();
      expect(mockUpdater).toBeCalled();
    });
  });

  describe("addPortalUpdater()", () => {
    it("correctly adds portal", () => {
      const portals = [getMockPortal("1")];
      const newPortal = getMockPortal("1");
      const result = addPortalUpdater(newPortal)(portals);
      expect(result).toEqual([...portals]);
    });

    it("does not add portal if another found with matching id", () => {
      const portals = [getMockPortal("1")];
      const newPortal = getMockPortal("2");
      const result = addPortalUpdater(newPortal)(portals);
      expect(result).toEqual([...portals, newPortal]);
    });
  });

  describe("removePortalByIdUpdater()", () => {
    it("correctly filters out portal by id", () => {
      const result = removePortalByIdUpdater("1")(mockPortals);
      expect(result[0].id).toEqual("2");
    });
  });

  describe("modifyPortalByIdUpdater()", () => {
    it("correctly updates specified portal by id", () => {
      const result = modifyPortalByIdUpdater({ open: false })("1")(mockPortals);
      expect(result.find((x) => x.id === "1")?.open).toEqual(false);
    });

    it("does not update non-specified portals", () => {
      const result = modifyPortalByIdUpdater({ open: false })("1")(mockPortals);
      expect(result.find((x) => x.id === "2")?.open).toEqual(true);
    });
  });
});
