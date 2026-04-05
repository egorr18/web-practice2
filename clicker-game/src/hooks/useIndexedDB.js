import { useCallback, useEffect, useState } from "react";

export function useIndexedDB(loadValue, saveValue) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        const result = await loadValue();
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        if (isMounted) {
          setStorageError(error.message || "Не вдалося завантажити дані з IndexedDB.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [loadValue]);

  const persist = useCallback(
    async (value) => {
      try {
        await saveValue(value);
        setStorageError("");
        return true;
      } catch (error) {
        setStorageError(error.message || "Не вдалося зберегти дані в IndexedDB.");
        return false;
      }
    },
    [saveValue]
  );

  return {
    data,
    isLoading,
    storageError,
    persist
  };
}
