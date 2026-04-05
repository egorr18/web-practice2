import {
  GAME_DB_NAME,
  GAME_STORAGE_KEY,
  GAME_STORE_NAME
} from "../utils/constants.js";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(GAME_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(GAME_STORE_NAME)) {
        database.createObjectStore(GAME_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadGameState() {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(GAME_STORE_NAME, "readonly");
    const store = transaction.objectStore(GAME_STORE_NAME);
    const request = store.get(GAME_STORAGE_KEY);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveGameState(value) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(GAME_STORE_NAME, "readwrite");
    const store = transaction.objectStore(GAME_STORE_NAME);
    const request = store.put(value, GAME_STORAGE_KEY);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
}
