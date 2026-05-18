"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { UserEntry, GroupEntry } from "@/types";

// Demo data — replace with real directory/IdP API calls
const DEMO_USERS: UserEntry[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    roles: ["admin"],
    groups: ["platform-engineering"],
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    roles: ["viewer"],
    groups: ["supply-chain"],
  },
  {
    id: "u3",
    name: "Carol White",
    email: "carol@example.com",
    roles: ["editor"],
    groups: ["finance", "platform-engineering"],
  },
];

const DEMO_GROUPS: GroupEntry[] = [
  { id: "g1", name: "platform-engineering", members: ["u1", "u3"], roles: ["admin"] },
  { id: "g2", name: "supply-chain", members: ["u2"], roles: ["editor"] },
  { id: "g3", name: "finance", members: ["u3"], roles: ["viewer"] },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [groups, setGroups] = useState<GroupEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(DEMO_USERS);
    setGroups(DEMO_GROUPS);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users &amp; Groups</h1>
        <p className="mt-1 text-sm text-gray-500">
          Map enterprise users and groups to PBAC policy subjects.
        </p>
      </div>

      {/* Users */}
      <Card title="Users">
        <div className="mb-4">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {["Name", "Email", "Roles", "Groups"].map((h) => (
                <th
                  key={h}
                  className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 pr-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="py-2 pr-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((r) => (
                      <Badge key={r} variant="blue">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {user.groups.map((g) => (
                      <Badge key={g} variant="gray">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Groups */}
      <Card title="Groups">
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between rounded-md border border-gray-200 p-3"
            >
              <div>
                <p className="font-medium text-gray-900">{group.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {group.members.length} member
                  {group.members.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-1">
                {group.roles.map((r) => (
                  <Badge key={r} variant="blue">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
