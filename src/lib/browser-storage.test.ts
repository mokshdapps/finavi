import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { DATA_KEY, LANGUAGE_KEY, readSavedValue } from "./browser-storage";

function memoryStorage(entries: Record<string, string>) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

describe("Finavi rebrand compatibility", () => {
  test("keeps existing financial data when the product is renamed", () => {
    const saved = JSON.stringify({ emergency: { amount: 320 }, tandas: [{ id: "family" }] });
    const storage = memoryStorage({ "equivest.data.v1": saved });
    assert.equal(readSavedValue(storage, DATA_KEY), saved);
    assert.equal(storage.getItem("finavi.data.v1"), saved);
    assert.equal(storage.getItem("equivest.data.v1"), null);
  });

  test("keeps the saved Spanish language preference", () => {
    const storage = memoryStorage({ "equivest.lang": "es" });
    assert.equal(readSavedValue(storage, LANGUAGE_KEY), "es");
    assert.equal(storage.getItem("finavi.lang"), "es");
    assert.equal(storage.getItem("equivest.lang"), null);
  });

  test("does not overwrite newer Finavi data with older data", () => {
    const storage = memoryStorage({ "finavi.data.v1": "new", "equivest.data.v1": "old" });
    assert.equal(readSavedValue(storage, DATA_KEY), "new");
    assert.equal(storage.getItem(DATA_KEY), "new");
  });
});
