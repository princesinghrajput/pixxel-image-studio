// Fix for Node.js 22+ with --localstorage-file flag
// When this flag is provided without a valid path, Node creates a broken
// localStorage global where methods like getItem are not functions.
// This causes crashes in libraries (next-themes, Clerk, etc.) that check
// `typeof localStorage !== 'undefined'` but then fail on method calls.

export async function register() {
  if (typeof window === "undefined") {
    try {
      // Check if localStorage exists but is broken (getItem is not a function)
      if (
        typeof globalThis.localStorage !== "undefined" &&
        typeof globalThis.localStorage?.getItem !== "function"
      ) {
        // Remove the broken localStorage global so libraries
        // correctly detect "no localStorage" on the server
        delete globalThis.localStorage;
      }
    } catch (e) {
      // If we can't delete it, override with undefined
      try {
        globalThis.localStorage = undefined;
      } catch (_) {
        // Silently ignore if even this fails
      }
    }
  }
}
