"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AuditEntry } from "@/types";

// Demo data — replace with real API call to OPA decision log endpoint
const DEMO_AUDIT: AuditEntry[] = Array.from({ length: 20 }, (_, i) => ({
  id: `ae-${i + 1}`,
  appId: i % 2 === 0 ? "inv-svc-prod" : "billing-api-prod",
  timestamp: new Date(Date.now() - i * 3_600_000).toISOString(),
  input: {
    subject: { id: `user-${(i % 5) + 1}`, roles: ["admin"] },
    resource: i % 3 === 0 ? "invoice" : "stock-item",
    action: i % 2 === 0 ? "read" : "write",
  },
  decision: i % 3 !== 0,
  policyId: `${i % 2 === 0 ? "inv_svc_prod" : "billing_api_prod"}/main`,
}));

const PAGE_SIZE = 10;

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // TODO: replace with real fetch from OPA decision logs API
    setEntries(DEMO_AUDIT);
  }, []);

  const total = entries.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Recent policy decisions made by OPA for onboarded applications.
        </p>
      </div>

      <Card>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {["Time", "App", "Subject", "Resource", "Action", "Decision"].map(
                (h) => (
                  <th
                    key={h}
                    className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paged.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="py-2 pr-4 text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="py-2 pr-4 text-xs font-mono text-gray-700">
                  {entry.appId}
                </td>
                <td className="py-2 pr-4 text-xs text-gray-700">
                  {entry.input.subject.id}
                </td>
                <td className="py-2 pr-4 text-xs text-gray-700">
                  {entry.input.resource}
                </td>
                <td className="py-2 pr-4 text-xs text-gray-700">
                  {entry.input.action}
                </td>
                <td className="py-2 pr-4">
                  <Badge variant={entry.decision ? "green" : "red"}>
                    {entry.decision ? "allow" : "deny"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              type="button"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              type="button"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
