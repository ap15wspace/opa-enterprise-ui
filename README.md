# OPA Enterprise UI — Self-Service PBAC

A React/Next.js web application that lets enterprise teams **self-service onboard their applications** into [Open Policy Agent (OPA)](https://www.openpolicyagent.org/)-managed Policy-Based Access Control (PBAC).

## Features

- **Dashboard** — overview of all onboarded applications and their PBAC status
- **App Onboarding Wizard** — 4-step wizard to register an app, define resources & actions, choose a policy template, and push the generated Rego policy to OPA
- **Policy Manager** — view, edit, and delete Rego policies stored in OPA
- **Audit Log** — paginated view of recent OPA policy decisions
- **User & Group Management** — map enterprise users/groups to policy subjects

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| Authentication | OIDC via `oidc-client-ts` + `react-oidc-context` |
| Code editor | CodeMirror (`@uiw/react-codemirror`) |
| Testing | Jest + React Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- A running [OPA](https://www.openpolicyagent.org/docs/latest/#running-opa) instance

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_OPA_BASE_URL` | OPA REST API base URL | `http://localhost:8181` |
| `NEXT_PUBLIC_OIDC_AUTHORITY` | OIDC provider URL | _(required for auth)_ |
| `NEXT_PUBLIC_OIDC_CLIENT_ID` | OIDC client ID | _(required for auth)_ |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Tests

```bash
npm test
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (nav)
│   ├── dashboard/          # Dashboard
│   ├── onboard/            # App Onboarding Wizard
│   ├── policies/           # Policy Manager
│   ├── audit/              # Audit Log
│   └── users/              # User & Group Management
├── components/
│   ├── ui/                 # Reusable primitives (Button, Card, Badge, Input)
│   └── wizard/             # Wizard step components
├── hooks/                  # Custom React hooks (usePolicies, usePolicyDecision)
├── lib/
│   ├── opaClient.ts        # Typed OPA REST API client
│   ├── auth.ts             # OIDC configuration
│   └── policyTemplates.ts  # Built-in Rego templates (RBAC, ABAC, Custom)
├── types/
│   └── index.ts            # Shared TypeScript types
└── __tests__/              # Unit tests
```

## Onboarding Workflow

1. Click **Onboard App** in the navigation.
2. **Step 1 — Register Application**: Enter the app name, client ID, description, and owner team.
3. **Step 2 — Resources & Actions**: Add the resources the app exposes and the actions subjects can perform.
4. **Step 3 — Policy Template**: Choose Role-Based, Attribute-Based, or write Custom Rego.
5. **Step 4 — Review & Activate**: Review (and optionally edit) the generated Rego, then click **Activate Policy**. This pushes the policy to OPA at `PUT /v1/policies/{clientId}/main`.

After activation your application can query OPA:

```bash
curl -X POST http://localhost:8181/v1/data/{clientId}/main \
  -H "Content-Type: application/json" \
  -d '{"input": {"subject": {"id": "u1", "roles": ["admin"]}, "resource": "invoice", "action": "read"}}'
```

## Agent Instructions

See [`prompts/agents.md`](prompts/agents.md) for the canonical coding agent instruction document.
