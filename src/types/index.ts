// ---------------------------------------------------------------------------
// Shared TypeScript interfaces for the OPA Enterprise UI
// ---------------------------------------------------------------------------

// --- Application registration -----------------------------------------------

export interface Application {
  id: string;
  name: string;
  clientId: string;
  description: string;
  ownerTeam: string;
  createdAt: string; // ISO-8601
  status: "active" | "inactive" | "pending";
}

export interface ApplicationFormData {
  name: string;
  clientId: string;
  description: string;
  ownerTeam: string;
}

// --- Resources & Actions -----------------------------------------------------

export interface ResourceDefinition {
  name: string;
  description: string;
  actions: string[];
}

// --- Policy Templates --------------------------------------------------------

export type PolicyTemplateId = "role_based" | "attribute_based" | "custom";

export interface PolicyTemplate {
  id: PolicyTemplateId;
  label: string;
  description: string;
  /** Function that generates Rego source given app context */
  generate: (ctx: PolicyTemplateContext) => string;
}

export interface PolicyTemplateContext {
  appId: string;
  resources: ResourceDefinition[];
}

// --- OPA Policy (as returned by /v1/policies) --------------------------------

export interface OpaPolicy {
  id: string;
  raw: string; // raw Rego source
}

export interface OpaPoliciesResponse {
  result: OpaPolicy[];
}

// --- OPA Decision ------------------------------------------------------------

export interface PolicyInput {
  subject: PolicySubject;
  resource: string;
  action: string;
  context?: Record<string, unknown>;
}

export interface PolicySubject {
  id: string;
  roles?: string[];
  attributes?: Record<string, unknown>;
}

export interface PolicyDecision {
  result?: {
    allow?: boolean;
    [key: string]: unknown;
  };
}

// --- Audit log ---------------------------------------------------------------

export interface AuditEntry {
  id: string;
  appId: string;
  timestamp: string; // ISO-8601
  input: PolicyInput;
  decision: boolean;
  policyId: string;
}

// --- User / Group management -------------------------------------------------

export interface UserEntry {
  id: string;
  name: string;
  email: string;
  roles: string[];
  groups: string[];
}

export interface GroupEntry {
  id: string;
  name: string;
  members: string[]; // user IDs
  roles: string[];
}

// --- Wizard state ------------------------------------------------------------

export interface OnboardingState {
  step: number;
  appData: ApplicationFormData;
  resources: ResourceDefinition[];
  templateId: PolicyTemplateId | null;
  customRego: string;
  generatedRego: string;
}
