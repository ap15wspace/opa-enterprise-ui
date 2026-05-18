"use client";

import { Input, Textarea } from "@/components/ui/Input";
import type { ApplicationFormData } from "@/types";

interface Props {
  data: ApplicationFormData;
  onChange: (data: ApplicationFormData) => void;
}

export function AppRegistrationForm({ data, onChange }: Props) {
  function handle(field: keyof ApplicationFormData, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Register Application
      </h2>
      <p className="text-sm text-gray-500">
        Provide basic information about the application you want to onboard to
        PBAC.
      </p>

      <Input
        id="app-name"
        label="Application Name"
        placeholder="e.g. inventory-service"
        value={data.name}
        onChange={(e) => handle("name", e.target.value)}
        required
      />

      <Input
        id="client-id"
        label="Client ID"
        placeholder="e.g. inv-svc-prod"
        value={data.clientId}
        onChange={(e) => handle("clientId", e.target.value)}
        required
        helperText="A unique identifier used as the OPA policy namespace."
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="What does this application do?"
        value={data.description}
        onChange={(e) => handle("description", e.target.value)}
        rows={3}
      />

      <Input
        id="owner-team"
        label="Owner Team"
        placeholder="e.g. platform-engineering"
        value={data.ownerTeam}
        onChange={(e) => handle("ownerTeam", e.target.value)}
        required
      />
    </div>
  );
}
