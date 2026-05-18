"use client";

import { useState, useCallback } from "react";
import type { PolicyInput, PolicyDecision } from "@/types";
import * as opaClient from "@/lib/opaClient";

export function usePolicyDecision() {
  const [decision, setDecision] = useState<PolicyDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(
    async (policyPath: string, input: PolicyInput) => {
      setLoading(true);
      setError(null);
      try {
        const result = await opaClient.queryDecision(policyPath, input);
        setDecision(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to evaluate policy"
        );
        setDecision(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { decision, loading, error, evaluate };
}
