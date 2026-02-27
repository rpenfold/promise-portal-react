import { defaultValue } from "../PromisePortalContext";

describe("PromisePortalContext", () => {
  it("context.showPortal throws error if provider not found", async () => {
    expect(() => defaultValue.showPortal("some_component")).toThrowError(
      "No provider found",
    );
  });

  it("context.showPortalAsync throws error if provider not found", async () => {
    expect(defaultValue.showPortalAsync("some_component")).rejects.toBe(
      "No provider found",
    );
  });

  it("context.clear throws error if provider not found", async () => {
    expect(() => defaultValue.clear()).toThrowError("No provider found");
  });
});
