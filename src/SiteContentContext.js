import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSiteContent } from "./siteContentDefaults";

const STORAGE_KEY = "portfolio.siteContent.v1";
const DB_FILE_PATH = "/site-content.db";

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
  return defaultSiteContent;
}

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [dbDefaults, setDbDefaults] = useState(defaultSiteContent);
  const [content, setContent] = useState(() => defaultSiteContent);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDbDefaults = async () => {
      try {
        const res = await fetch(`${DB_FILE_PATH}?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        if (!res.ok) return;
        const dbData = await res.json();
        const mergedDefaults = mergeWithDefaults(defaultSiteContent, dbData);
        if (!isMounted) return;

        setDbDefaults(mergedDefaults);
        setContent(mergedDefaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedDefaults));
      } catch (error) {
        console.error("Failed to load .db defaults:", error);
      } finally {
        if (isMounted) setIsDbLoaded(true);
      }
    };

    loadDbDefaults();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      isDbLoaded,
      resetContent: () => setContent(dbDefaults),
      exportContent: () => JSON.stringify(content, null, 2),
    }),
    [content, dbDefaults, isDbLoaded]
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
