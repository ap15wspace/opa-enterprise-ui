"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppRegistrationForm } from "@/components/wizard/AppRegistrationForm";
import { ResourceActionsForm } from "@/components/wizard/ResourceActionsForm";
import { PolicyTemplateSelector } from "@/components/wizard/PolicyTemplateSelector";
import { RegoEditor } from "@/components/wizard/RegoEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { putPolicy } from "@/lib/opaClient";
import { getTemplate } from "@/lib/policyTemplates";
import type { OnboardingState } from "@/types";

const STEPS = [
  "Register Application",
  "Resources & Actions",
  "Policy Template",
  "Review & Activate",
];

const initialState: OnboardingState = {
  step: 0,
  appData: { name: "", clientId: "", description: "", ownerTeam: "" },
  resources: [],
  templateId: null,
  customRego: "",
  generatedRego: "",
};

export default function OnboardPage() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function next() {
    if (state.step === 2) {
      // Generate Rego from selected template
      const tpl = state.templateId ? getTemplate(state.templateId) : null;
      const generated = tpl
        ? tpl.generate({ appId: state.appData.clientId, resources: state.resources })
        : state.customRego;
      setState((s) => ({ ...s, step: s.step + 1, generatedRego: generated }));
    } else {
      setState((s) => ({ ...s, step: s.step + 1 }));
    }
  }

  function back() {
    setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
  }

  async function activate() {
    setSaving(true);
    setError(null);
    try {
      const policyId = `${state.appData.clientId}/main`;
      await putPolicy(policyId, state.generatedRego);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate policy");
    } finally {
      setSaving(false);
    }
  }

  const canNext =
    (state.step === 0 &&
      state.appData.name &&
      state.appData.clientId &&
      state.appData.ownerTeam) ||
    (state.step === 1 && state.resources.length > 0) ||
    (state.step === 2 && state.templateId !== null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Onboard Application</h1>

      {/* Step indicator */}
      <nav aria-label="Wizard steps">
        <ol className="flex items-center gap-0">
          {STEPS.map((label, idx) => (
            <li key={label} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    idx < state.step
                      ? "bg-indigo-600 text-white"
                      : idx === state.step
                      ? "border-2 border-indigo-600 text-indigo-600"
                      : "border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {idx < state.step ? "✓" : idx + 1}
                </span>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    idx === state.step ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-2" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step content */}
      <Card>
        {state.step === 0 && (
          <AppRegistrationForm
            data={state.appData}
            onChange={(appData) => setState((s) => ({ ...s, appData }))}
          />
        )}

        {state.step === 1 && (
          <ResourceActionsForm
            resources={state.resources}
            onChange={(resources) => setState((s) => ({ ...s, resources }))}
          />
        )}

        {state.step === 2 && (
          <>
            <PolicyTemplateSelector
              selected={state.templateId}
              onSelect={(templateId) =>
                setState((s) => ({ ...s, templateId }))
              }
            />
            {state.templateId === "custom" && (
              <div className="mt-4">
                <RegoEditor
                  value={state.customRego}
                  onChange={(customRego) =>
                    setState((s) => ({ ...s, customRego }))
                  }
                />
              </div>
            )}
          </>
        )}

        {state.step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Review &amp; Activate
            </h2>
            <p className="text-sm text-gray-500">
              Review the generated Rego policy below. When you activate it,
              it will be pushed to OPA as{" "}
              <code className="text-xs bg-gray-100 rounded px-1 py-0.5">
                {state.appData.clientId}/main
              </code>
              .
            </p>
            <RegoEditor
              value={state.generatedRego}
              onChange={(generatedRego) =>
                setState((s) => ({ ...s, generatedRego }))
              }
            />
            {error && (
              <div className="rounded bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={back}
          disabled={state.step === 0}
          type="button"
        >
          Back
        </Button>

        {state.step < STEPS.length - 1 ? (
          <Button onClick={next} disabled={!canNext} type="button">
            Next
          </Button>
        ) : (
          <Button onClick={activate} disabled={saving} type="button">
            {saving ? "Activating…" : "Activate Policy"}
          </Button>
        )}
      </div>
    </div>
  );
}
