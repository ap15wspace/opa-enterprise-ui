import axios, { AxiosInstance } from "axios";
import type {
  OpaPolicy,
  OpaPoliciesResponse,
  PolicyInput,
  PolicyDecision,
} from "@/types";

// ---------------------------------------------------------------------------
// OPA REST API client
// All communication with OPA goes through this module.
// ---------------------------------------------------------------------------

function createOpaClient(): AxiosInstance {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_OPA_BASE_URL ?? "http://localhost:8181",
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
  });
}

const client = createOpaClient();

// --- Policy CRUD ------------------------------------------------------------

/** List all policies stored in OPA. */
export async function listPolicies(): Promise<OpaPolicy[]> {
  const res = await client.get<OpaPoliciesResponse>("/v1/policies");
  return res.data.result;
}

/** Fetch a single policy by ID. */
export async function getPolicy(id: string): Promise<OpaPolicy> {
  const res = await client.get<{ result: OpaPolicy }>(`/v1/policies/${encodeURIComponent(id)}`);
  return res.data.result;
}

/**
 * Create or update a policy.
 * @param id  OPA policy ID (e.g. "myapp/main")
 * @param rego Raw Rego source
 */
export async function putPolicy(id: string, rego: string): Promise<void> {
  await client.put(`/v1/policies/${encodeURIComponent(id)}`, rego, {
    headers: { "Content-Type": "text/plain" },
  });
}

/** Delete a policy by ID. */
export async function deletePolicy(id: string): Promise<void> {
  await client.delete(`/v1/policies/${encodeURIComponent(id)}`);
}

// --- Decision query ---------------------------------------------------------

/**
 * Query an OPA policy path with an input document.
 * @param policyPath  Path under `/v1/data/`, e.g. "myapp/allow"
 * @param input       The input document sent to OPA
 */
export async function queryDecision(
  policyPath: string,
  input: PolicyInput
): Promise<PolicyDecision> {
  const res = await client.post<PolicyDecision>(
    `/v1/data/${policyPath}`,
    { input }
  );
  return res.data;
}
