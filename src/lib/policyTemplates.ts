import type { PolicyTemplate, PolicyTemplateContext } from "@/types";

// ---------------------------------------------------------------------------
// Built-in Rego policy templates
// ---------------------------------------------------------------------------

const roleBased: PolicyTemplate = {
  id: "role_based",
  label: "Role-Based Access Control",
  description:
    "Grant access based on the roles assigned to the subject. Define which roles are allowed to perform each action on each resource.",
  generate: ({ appId, resources }: PolicyTemplateContext): string => {
    const resourceRules = resources
      .flatMap(({ name, actions }) =>
        actions.map(
          (action) =>
            `# Allow "${action}" on "${name}" for admins\nallow {\n  input.resource == "${name}"\n  input.action == "${action}"\n  input.subject.roles[_] == "admin"\n}`
        )
      )
      .join("\n\n");

    return `package ${appId.replace(/-/g, "_")}.main

import future.keywords.if

default allow := false

${resourceRules}
`;
  },
};

const attributeBased: PolicyTemplate = {
  id: "attribute_based",
  label: "Attribute-Based Access Control",
  description:
    "Grant access based on arbitrary attributes on the subject or resource. Useful for fine-grained, context-aware policies.",
  generate: ({ appId, resources }: PolicyTemplateContext): string => {
    const resourceRules = resources
      .flatMap(({ name, actions }) =>
        actions.map(
          (action) =>
            `# Allow "${action}" on "${name}" when subject has required attribute\nallow {\n  input.resource == "${name}"\n  input.action == "${action}"\n  input.subject.attributes.department == "engineering"\n}`
        )
      )
      .join("\n\n");

    return `package ${appId.replace(/-/g, "_")}.main

import future.keywords.if

default allow := false

${resourceRules}
`;
  },
};

const custom: PolicyTemplate = {
  id: "custom",
  label: "Custom Rego",
  description:
    "Write your own Rego policy from scratch. Full access to all OPA built-in functions.",
  generate: ({ appId }: PolicyTemplateContext): string =>
    `package ${appId.replace(/-/g, "_")}.main

import future.keywords.if

default allow := false

# Add your rules below
allow if {
  # your conditions here
}
`,
};

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  roleBased,
  attributeBased,
  custom,
];

export function getTemplate(id: string): PolicyTemplate | undefined {
  return POLICY_TEMPLATES.find((t) => t.id === id);
}
