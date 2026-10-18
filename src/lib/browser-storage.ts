type StorageAccess = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const DATA_KEY = "finavi.data.v1";
export const LANGUAGE_KEY = "finavi.lang";

const previousKeys: Record<string, string> = {
  [DATA_KEY]: "equivest.data.v1",
  [LANGUAGE_KEY]: "equivest.lang",
};

export function readSavedValue(storage: StorageAccess, key: string): string | null {
  const current = storage.getItem(key);
  const previousKey = previousKeys[key];
  if (current !== null || !previousKey) return current;

  const previous = storage.getItem(previousKey);
  if (previous === null) return null;

  storage.setItem(key, previous);
  storage.removeItem(previousKey);
  return previous;
}
