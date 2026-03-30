"use client";

import { useState, useEffect, useMemo, useRef } from "react";

const categoryCache = new Map<number, string>();

export function useProductCategories(productIds: number[]): Record<number, string> {
  const [fetchedCategories, setFetchedCategories] = useState<Record<number, string>>({});
  const prevIdsRef = useRef<string>("");

  const cachedCategories = useMemo(() => {
    const result: Record<number, string> = {};
    for (const id of productIds) {
      const name = categoryCache.get(id);
      if (name) result[id] = name;
    }
    return result;
  }, [productIds]);

  const uncachedIds = useMemo(() => {
    return productIds.filter((id) => !categoryCache.has(id));
  }, [productIds]);

  useEffect(() => {
    if (uncachedIds.length === 0) return;

    const idsKey = [...uncachedIds].sort((a, b) => a - b).join(",");
    if (idsKey === prevIdsRef.current) return;
    prevIdsRef.current = idsKey;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`/api/product-categories?ids=${uncachedIds.join(",")}`);
        const data = await response.json();
        if (cancelled) return;

        const fetched: Record<number, string> = data.categories || {};
        for (const [id, name] of Object.entries(fetched)) {
          categoryCache.set(Number(id), name as string);
        }

        setFetchedCategories(fetched);
      } catch {
        // silently fail
      }
    })();

    return () => { cancelled = true; };
  }, [uncachedIds]);

  return useMemo(() => ({ ...cachedCategories, ...fetchedCategories }), [cachedCategories, fetchedCategories]);
}
