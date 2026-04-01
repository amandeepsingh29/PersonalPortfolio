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
  const [dbDefaults, setDbDefaults] = useState(defaultSiteContent);
  const [content, setContent] = useState(() => parseStoredContent());

  useEffect(() => {
    let isMounted = true;

    const loadDbDefaults = async () => {
      try {
        const res = await fetch(DB_FILE_PATH);
        if (!res.ok) return;
        const dbData = await res.json();
        const mergedDefaults = mergeWithDefaults(defaultSiteContent, dbData);
        const dbVersion = mergedDefaults?.meta?.version;
        if (!isMounted) return;

        setDbDefaults(mergedDefaults);

        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setContent(mergedDefaults);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedDefaults));
          return;
        }

        const parsed = JSON.parse(raw);
        const localVersion = parsed?.meta?.version;

        if (dbVersion && localVersion !== dbVersion) {
          setContent(mergedDefaults);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedDefaults));
          return;
        }

        const mergedWithLocal = mergeWithDefaults(mergedDefaults, parsed);
        setContent(mergedWithLocal);
      } catch (error) {
        console.error("Failed to load .db defaults:", error);
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
      resetContent: () => setContent(dbDefaults),
      exportContent: () => JSON.stringify(content, null, 2),
    }),
    [content, dbDefaults]
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
