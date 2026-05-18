"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RegoEditor } from "@/components/wizard/RegoEditor";
import { usePolicies } from "@/hooks/usePolicies";

export default function PoliciesPage() {
  const { policies, loading, error, fetchPolicies, savePolicy, removePolicy } =
    usePolicies();
  const [editing, setEditing] = useState<{ id: string; raw: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    try {
      await savePolicy(editing.id, editing.raw);
      setEditing(null);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save policy"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete policy "${id}"? This cannot be undone.`)) return;
    await removePolicy(id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          View, edit, or delete Rego policies stored in OPA.
        </p>
      </div>

      {error && (
        <div className="rounded bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading policies…</p>
      ) : (
        <div className="space-y-4">
          {policies.length === 0 && (
            <p className="text-sm text-gray-400 italic">No policies found.</p>
          )}

          {policies.map((policy) =>
            editing?.id === policy.id ? (
              <Card key={policy.id} title={`Editing: ${policy.id}`}>
                <RegoEditor
                  value={editing.raw}
                  onChange={(raw) => setEditing({ ...editing, raw })}
                />
                {saveError && (
                  <p className="mt-2 text-sm text-red-600">{saveError}</p>
                )}
                <div className="mt-4 flex gap-2 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(null)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} type="button">
                    {saving ? "Saving…" : "Save Policy"}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card key={policy.id} title={policy.id}>
                <pre className="text-xs font-mono text-gray-700 bg-gray-50 rounded p-3 overflow-x-auto max-h-48">
                  {policy.raw}
                </pre>
                <div className="mt-3 flex gap-2 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setEditing({ id: policy.id, raw: policy.raw })
                    }
                    type="button"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(policy.id)}
                    type="button"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
