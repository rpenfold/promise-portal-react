import PromisePortal, { ComponentRegistry, usePromisePortal } from "..";

describe("index", () => {
  it("PromisePortal export works correctly", () => {
    expect(PromisePortal).toBeDefined();
    expect(PromisePortal.Provider).toBeDefined();
    expect(PromisePortal.showPortalAsync).toBeDefined();
  });

  it("ComponentRegistry export works correctly", () => {
    expect(ComponentRegistry).toBeDefined();
  });

  it("usePromisePortal export works correclty", () => {
    expect(usePromisePortal).toBeDefined();
  });
});
