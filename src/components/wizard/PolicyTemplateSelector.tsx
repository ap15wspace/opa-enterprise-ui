"use client";

import { POLICY_TEMPLATES } from "@/lib/policyTemplates";
import type { PolicyTemplateId } from "@/types";

interface Props {
  selected: PolicyTemplateId | null;
  onSelect: (id: PolicyTemplateId) => void;
}

export function PolicyTemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Choose a Policy Template
      </h2>
      <p className="text-sm text-gray-500">
        Select the type of access control policy to generate for your
        application.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {POLICY_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            className={`rounded-lg border-2 p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              selected === tpl.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <p className="font-semibold text-gray-900">{tpl.label}</p>
            <p className="mt-1 text-xs text-gray-500">{tpl.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
