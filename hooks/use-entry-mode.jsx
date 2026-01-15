"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pixxel-entry-mode";
const EVENT_NAME = "pixxel-entry-mode-change";

export function getEntryMode() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEY);
}

export function setEntryMode(mode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function clearEntryMode() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function hasActiveSession(entryMode) {
  return ["demo", "signin", "signup"].includes(entryMode);
}

export function useEntryMode() {
  const [entryMode, setMode] = useState(null);

  useEffect(() => {
    const syncEntryMode = () => {
      setMode(getEntryMode());
    };

    syncEntryMode();
    window.addEventListener(EVENT_NAME, syncEntryMode);
    window.addEventListener("storage", syncEntryMode);

    return () => {
      window.removeEventListener(EVENT_NAME, syncEntryMode);
      window.removeEventListener("storage", syncEntryMode);
    };
  }, []);

  return entryMode;
}
