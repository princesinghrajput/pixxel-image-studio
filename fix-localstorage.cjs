// Preload script: fixes broken localStorage in Node.js 22+
// When --localstorage-file is provided without a valid path, Node creates
// a localStorage global where methods like getItem are not functions.
// This script MUST run via --require BEFORE any other code.

if (typeof globalThis.localStorage !== 'undefined') {
  try {
    // Test if localStorage actually works
    globalThis.localStorage.getItem('__test__');
  } catch (e) {
    // localStorage is broken — replace with a working in-memory implementation
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.has(key) ? store.get(key) : null,
      setItem: (key, value) => store.set(String(key), String(value)),
      removeItem: (key) => store.delete(String(key)),
      clear: () => store.clear(),
      get length() { return store.size; },
      key: (index) => {
        const keys = [...store.keys()];
        return index < keys.length ? keys[index] : null;
      },
    };
  }
}
