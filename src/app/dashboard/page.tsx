"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Application } from "@/types";

// ---------------------------------------------------------------------------
// Demo data — replace with real API calls in production
// ---------------------------------------------------------------------------
const DEMO_APPS: Application[] = [
  {
    id: "1",
    name: "inventory-service",
    clientId: "inv-svc-prod",
    description: "Manages inventory items and stock levels",
    ownerTeam: "supply-chain",
    createdAt: "2024-01-15T09:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "billing-api",
    clientId: "billing-api-prod",
    description: "Handles invoice generation and payment processing",
    ownerTeam: "finance",
    createdAt: "2024-02-20T14:30:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "reporting-dashboard",
    clientId: "reports-ui",
    description: "Executive reporting and analytics dashboard",
    ownerTeam: "data-platform",
    createdAt: "2024-03-10T11:00:00Z",
    status: "pending",
  },
];

const statusVariant: Record<Application["status"], "green" | "yellow" | "gray"> = {
  active: "green",
  pending: "yellow",
  inactive: "gray",
};

export default function DashboardPage() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    // TODO: replace with real API call
    setApps(DEMO_APPS);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of applications enrolled in PBAC
          </p>
        </div>
        <Link href="/onboard">
          <Button>+ Onboard Application</Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Applications", value: apps.length },
          { label: "Active", value: apps.filter((a) => a.status === "active").length },
          { label: "Pending Activation", value: apps.filter((a) => a.status === "pending").length },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Application table */}
      <Card title="Onboarded Applications">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {["Name", "Client ID", "Owner Team", "Status", "Onboarded", ""].map(
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
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4 text-sm font-medium text-gray-900">
                  {app.name}
                </td>
                <td className="py-3 pr-4 text-sm text-gray-600 font-mono">
                  {app.clientId}
                </td>
                <td className="py-3 pr-4 text-sm text-gray-600">
                  {app.ownerTeam}
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={statusVariant[app.status]}>
                    {app.status}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/policies?app=${app.clientId}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Manage Policies →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
