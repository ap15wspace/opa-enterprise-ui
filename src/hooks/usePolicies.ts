"use client";

import { useState, useCallback } from "react";
import type { OpaPolicy } from "@/types";
import * as opaClient from "@/lib/opaClient";

export function usePolicies() {
  const [policies, setPolicies] = useState<OpaPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opaClient.listPolicies();
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load policies");
    } finally {
      setLoading(false);
    }
  }, []);

  const savePolicy = useCallback(async (id: string, rego: string) => {
    await opaClient.putPolicy(id, rego);
    await fetchPolicies();
  }, [fetchPolicies]);

  const removePolicy = useCallback(async (id: string) => {
    await opaClient.deletePolicy(id);
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { policies, loading, error, fetchPolicies, savePolicy, removePolicy };
}
