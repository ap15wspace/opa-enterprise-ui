"use client";

import type { PolicyDecision as PolicyDecisionType } from "@/types";

interface Props {
  decision: PolicyDecisionType | null;
  loading?: boolean;
  error?: string;
}

export function PolicyDecisionViewer({ decision, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        Evaluating policy…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!decision) return null;

  const allowed = decision.result?.allow;

  return (
    <div
      className={`rounded-md p-4 ${
        allowed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
      }`}
    >
      <p
        className={`text-lg font-bold ${
          allowed ? "text-green-700" : "text-red-700"
        }`}
      >
        {allowed ? "✓ Access Allowed" : "✗ Access Denied"}
      </p>
      <pre className="mt-2 text-xs overflow-x-auto text-gray-600">
        {JSON.stringify(decision.result, null, 2)}
      </pre>
    </div>
  );
}
