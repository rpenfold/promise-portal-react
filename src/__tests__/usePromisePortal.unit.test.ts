import { renderHook } from "@testing-library/react-hooks";
import { PromisePortalActions } from "../types";
import usePromisePortal from "../usePromisePortal";

describe("usePromisePortal", () => {
  const {
    result: { current },
  } = renderHook(() => usePromisePortal());
  const context = current as PromisePortalActions;

  it("exposes showPortalAsync function", () => {
    expect(context.showPortalAsync).toBeDefined();
  });
});
