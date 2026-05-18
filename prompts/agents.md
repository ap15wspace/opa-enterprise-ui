# Agent Instructions — OPA Enterprise UI (Self-Service PBAC)

## Purpose

This repository provides a **self-service Policy-Based Access Control (PBAC) UI** for enterprises.
It allows application teams and enterprise admins to onboard their applications into
[Open Policy Agent (OPA)](https://www.openpolicyagent.org/) managed policy enforcement — without
needing deep OPA or Rego expertise.

The UI talks to OPA's REST API to push Rego policies and query access decisions. It is built with
**Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

---

## PBAC Concepts

| Term | Definition |
|------|-----------|
| **Subject** | The entity requesting access — a user, service account, or group. |
| **Resource** | The object being accessed — an API endpoint, a document, a database row. |
| **Action** | The operation being performed — `read`, `write`, `delete`, `execute`. |
| **Context** | Additional environmental attributes used in policy evaluation — time of day, IP address, tenant ID. |
| **Policy** | A Rego rule that evaluates subject + resource + action + context and returns `allow` or `deny`. |
| **Decision** | The result returned by OPA after evaluating a policy against a specific input. |
| **Bundle** | A tarball of Rego policy files that can be pushed to OPA as a unit. |

---

## OPA Integration

The UI communicates with OPA via its REST API:

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Query a decision | `POST` | `/v1/data/{policy_path}` |
| List all policies | `GET` | `/v1/policies` |
| Get a policy | `GET` | `/v1/policies/{id}` |
| Create / update a policy | `PUT` | `/v1/policies/{id}` |
| Delete a policy | `DELETE` | `/v1/policies/{id}` |

The OPA base URL is configured via the `NEXT_PUBLIC_OPA_BASE_URL` environment variable.

All API calls go through the typed client in `src/lib/opaClient.ts`.

---

## Onboarding Workflow

An enterprise admin follows this wizard to register and activate PBAC for an application:

1. **Register Application** — Provide app name, client ID, description, and owner team.
2. **Define Resources & Actions** — List the resources the app exposes and which actions are relevant.
3. **Assign Policy Templates** — Choose from built-in Rego templates:
   - *Role-based* — grant access based on user roles.
   - *Attribute-based* — grant access based on user or resource attributes.
   - *Custom Rego* — write or paste raw Rego policy.
4. **Review & Activate** — Preview the generated Rego, then push it to OPA (`PUT /v1/policies/{id}`).

After activation, the application can query OPA at `/v1/data/{app_id}/allow` with an input payload
containing `subject`, `resource`, `action`, and `context`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| HTTP client | Axios (`src/lib/opaClient.ts`) |
| Authentication | OIDC via `oidc-client-ts` + `react-oidc-context` |
| Code editor | CodeMirror (`@uiw/react-codemirror`) |
| Testing | Jest + React Testing Library |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Auth provider, nav)
│   ├── page.tsx            # Redirect to /dashboard
│   ├── dashboard/          # Dashboard — list of onboarded apps
│   ├── onboard/            # App Onboarding Wizard
│   ├── policies/           # Policy Manager (list/edit/delete)
│   ├── audit/              # Audit Log
│   └── users/              # User & Group Management
├── components/
│   ├── ui/                 # Reusable primitives (Button, Card, Badge, …)
│   └── wizard/             # Wizard step components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── opaClient.ts        # Typed OPA REST API client
│   ├── auth.ts             # OIDC configuration helper
│   └── policyTemplates.ts  # Built-in Rego templates
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── __tests__/              # Unit & integration tests
```

---

## Coding Conventions

- **Components**: Functional components with named exports. Props typed with interfaces.
- **State management**: React `useState` / `useReducer` for local state; no global state library unless complexity demands it.
- **API calls**: Always use the typed helpers in `src/lib/opaClient.ts`. Never call `fetch`/`axios` directly from components.
- **Error handling**: API errors must surface a user-facing message via `try/catch`; never swallow errors silently.
- **Tailwind**: Use utility classes directly. Extract repeated patterns into `src/components/ui/` primitives.
- **Testing**: Every component must have at least a smoke test. API client functions must have unit tests with mocked Axios.
- **Environment variables**: Prefix with `NEXT_PUBLIC_` only when the value is needed on the client. Keep secrets server-side.

---

## Agent Tasks

The coding agent is authorised to:

- Generate and modify React components and Next.js pages.
- Add or update Rego policy templates in `src/lib/policyTemplates.ts`.
- Add typed methods to `src/lib/opaClient.ts`.
- Write Jest unit tests for components and API helpers.
- Update Tailwind styles.
- Update this `agents.md` file when new conventions or capabilities are added.

The agent must **not**:

- Commit secrets, credentials, or real OPA tokens.
- Remove or weaken existing authentication guards.
- Push directly to the `main` branch (all changes go via pull requests).
