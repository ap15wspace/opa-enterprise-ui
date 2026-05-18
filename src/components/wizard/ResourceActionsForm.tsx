"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { ResourceDefinition } from "@/types";

interface Props {
  resources: ResourceDefinition[];
  onChange: (resources: ResourceDefinition[]) => void;
}

const DEFAULT_ACTIONS = ["read", "write", "delete"];

export function ResourceActionsForm({ resources, onChange }: Props) {
  const [newResource, setNewResource] = useState("");
  const [newAction, setNewAction] = useState<Record<number, string>>({});

  function addResource() {
    const name = newResource.trim();
    if (!name) return;
    onChange([...resources, { name, description: "", actions: [...DEFAULT_ACTIONS] }]);
    setNewResource("");
  }

  function removeResource(idx: number) {
    onChange(resources.filter((_, i) => i !== idx));
  }

  function addAction(idx: number) {
    const action = (newAction[idx] ?? "").trim();
    if (!action) return;
    const updated = resources.map((r, i) =>
      i === idx ? { ...r, actions: [...r.actions, action] } : r
    );
    onChange(updated);
    setNewAction((prev) => ({ ...prev, [idx]: "" }));
  }

  function removeAction(resourceIdx: number, action: string) {
    const updated = resources.map((r, i) =>
      i === resourceIdx
        ? { ...r, actions: r.actions.filter((a) => a !== action) }
        : r
    );
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Define Resources &amp; Actions
      </h2>
      <p className="text-sm text-gray-500">
        List the resources your application exposes and which actions subjects
        can perform on them.
      </p>

      {/* Add new resource */}
      <div className="flex gap-2">
        <Input
          id="new-resource"
          placeholder="Resource name (e.g. invoice)"
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addResource()}
          className="flex-1"
        />
        <Button onClick={addResource} type="button">
          Add Resource
        </Button>
      </div>

      {/* Resource list */}
      <div className="space-y-3">
        {resources.map((res, idx) => (
          <div
            key={idx}
            className="rounded-md border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{res.name}</span>
              <Button
                variant="danger"
                size="sm"
                type="button"
                onClick={() => removeResource(idx)}
              >
                Remove
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-1">
              {res.actions.map((action) => (
                <Badge key={action} variant="blue">
                  {action}
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-900"
                    onClick={() => removeAction(idx, action)}
                    aria-label={`Remove action ${action}`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add action */}
            <div className="flex gap-2">
              <Input
                placeholder="Add action (e.g. approve)"
                value={newAction[idx] ?? ""}
                onChange={(e) =>
                  setNewAction((prev) => ({ ...prev, [idx]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addAction(idx)}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => addAction(idx)}
              >
                Add Action
              </Button>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          No resources added yet. Add at least one resource to continue.
        </p>
      )}
    </div>
  );
}
