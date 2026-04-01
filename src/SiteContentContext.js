import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent } from "./siteContentDefaults";

const STORAGE_KEY = "portfolio.siteContent.v1";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults(defaultValue, storedValue) {
  if (storedValue === undefined) return defaultValue;

  if (Array.isArray(defaultValue)) {
    return Array.isArray(storedValue) ? storedValue : defaultValue;
  }

  if (isPlainObject(defaultValue)) {
    if (!isPlainObject(storedValue)) return defaultValue;

    const merged = { ...defaultValue };
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(storedValue)]);
    keys.forEach((key) => {
      merged[key] = mergeWithDefaults(defaultValue[key], storedValue[key]);
    });
    return merged;
  }

  return storedValue;
}

function parseStoredContent() {
  if (typeof window === "undefined") return defaultSiteContent;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSiteContent;
    const parsed = JSON.parse(raw);
    return mergeWithDefaults(defaultSiteContent, parsed);
  } catch (error) {
    console.error("Failed to parse saved site content:", error);
    return defaultSiteContent;
  }
}

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => parseStoredContent());

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      resetContent: () => setContent(defaultSiteContent),
      exportContent: () => JSON.stringify(content, null, 2),
    }),
    [content]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return ctx;
}
