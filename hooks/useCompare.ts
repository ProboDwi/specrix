"use client";
import { useCallback, useEffect, useState } from "react";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_KEY = "specrix_compare";

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>([]);

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

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, add, remove, clear, has };
}
