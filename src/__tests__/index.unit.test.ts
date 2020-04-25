import PromisePortal, {
    ComponentRegistry
} from "..";

describe("index", () => {
    it("PromisePortal export works correctly", () => {
        expect(PromisePortal).toBeDefined();
    });

    it("ComponentRegistry export works correctly", () => {
        expect(ComponentRegistry).toBeDefined();
    });
});
