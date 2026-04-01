import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";

const AUTH_FLAG_KEY = "portfolio.admin.imageAuth.v1";
const KEY_IMAGE_PATH = "/images/projects/bulb.png";

async function sha256Hex(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminImageGate({ children }) {
  const { isDark } = useTheme();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_FLAG_KEY);
    if (saved === "ok") {
      setIsUnlocked(true);
    }
  }, []);

  const verifyImage = async (file) => {
    if (!file) return;

    setIsChecking(true);
    setStatus("Verifying image key...");

    try {
      const [uploadedBuffer, keyRes] = await Promise.all([
        file.arrayBuffer(),
        fetch(KEY_IMAGE_PATH),
      ]);

      if (!keyRes.ok) {
        setStatus("Key image not found on server.");
        setIsChecking(false);
        return;
      }

      const keyBuffer = await keyRes.arrayBuffer();
      const [uploadedHash, keyHash] = await Promise.all([
        sha256Hex(uploadedBuffer),
        sha256Hex(keyBuffer),
      ]);

      if (uploadedHash === keyHash) {
        sessionStorage.setItem(AUTH_FLAG_KEY, "ok");
        setIsUnlocked(true);
        setStatus("Access granted.");
      } else {
        setStatus("Access denied.");
      }
    } catch (error) {
      setStatus("Authentication failed. Please try again.");
      console.error("Admin image auth error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isUnlocked) {
    return children;
  }

  return (
    <section className={`mx-auto max-w-xl px-6 py-20 ${isDark ? "text-white" : "text-gray-900"}`}>
      <div className={`rounded-2xl border p-8 ${isDark ? "border-gray-800 bg-[#12121a]" : "border-gray-200 bg-white"}`}>
        <p className="font-mono-space text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">[ ADMIN LOCK ]</p>
        <h1 className="mt-2 text-2xl font-black">Admin Access</h1>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Authentication required.
        </p>

        <div className="mt-6">
          <input
            type="file"
            accept="image/png,image/*"
            disabled={isChecking}
            onChange={(e) => verifyImage(e.target.files?.[0])}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-200 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-300 dark:text-gray-300 dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600"
          />
        </div>

        {status && (
          <p className={`mt-4 rounded-lg border px-3 py-2 text-xs ${isDark ? "border-gray-700 bg-black/20 text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700"}`}>
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
