"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_KEY = "specrix_compare";

interface CompareContextValue {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const add = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.length >= 3 || prev.some((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, has }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside <CompareProvider>");
  return ctx;
}
