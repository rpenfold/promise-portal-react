import PromisePortal, { ComponentRegistry, usePromisePortal, withPromisePortal } from "..";

describe("index", () => {
  it("PromisePortal export works correctly", () => {
    expect(PromisePortal).toBeDefined();
    expect(PromisePortal.Provider).toBeDefined();
    expect(PromisePortal.showPortalAsync).toBeDefined();
  });

  it("ComponentRegistry export works correctly", () => {
    expect(ComponentRegistry).toBeDefined();
  });

  it("withPromisePortal export works correctly", () => {
    expect(withPromisePortal).toBeDefined();
  });

  it("usePromisePortal export works correclty", () => {
    expect(usePromisePortal).toBeDefined();
  });
});
