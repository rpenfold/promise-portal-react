import generateSimpleUniqueId from "../simpleUniqueId";

describe("simpleUniqueId", () => {
  // This test is O(n^2) complexity. No need to improve efficiency; test only takes about
  // one second to run, and 10000 unique values is more than enough for our needs.
  it("generates unique IDs", () => {
    const ids: Array<string> = [];
    for (let i = 0; i < 10000; i++) {
      ids[i] = generateSimpleUniqueId();
      const newId = ids[i];
      expect(ids.indexOf(newId)).toEqual(i); // should not find value before current index
    }
  });
});
