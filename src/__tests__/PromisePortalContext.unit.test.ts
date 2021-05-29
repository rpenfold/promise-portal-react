import { defaultValue } from "../PromisePortalContext";

describe("PromisePortalContext", () => {
  it("context.showPortalAsync throws error if provider not found", async () => {
    expect(defaultValue.showPortalAsync("some_component")).rejects.toBe(
      "No provider found"
    );
  });

  it("context.clear throws error if provider not found", async () => {
    expect(defaultValue.clear()).rejects.toBe("No provider found");
  });
});
