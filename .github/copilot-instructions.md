# Copilot Instructions — Agentic Platform

This repository is based on the Agentic AI-native development platform.

Projects created from this template follow a documentation-driven workflow, modular architecture starters, and AI-assisted development agents.

Copilot should follow the rules defined in this document when assisting development.

---

# 1. Project Structure

The project uses a deterministic structure.

app/
   backend/
   web/
   client/
   infra/
   contracts/
   composition/

docs/
.github/

Architecture modules are installed using official starters.

Starter mapping:

agentic-clean-backend OR agentic-dotnet-backend → app/backend  
agentic-react-spa OR agentic-angular-spa → app/web  
agentic-flutter-client OR agentic-react-native → app/client  
agentic-api-contracts-api → app/contracts  
agentic-postgres-dev → app/infra  
agentic-fullstack-composition → app/composition  

Optional foundation starter mapping:

agentic-iam → manual copy or subtree-vendor (docs + governance artifacts)

Do not invent alternative install paths.

---

# 2. Documentation-First Development

Development follows a documentation-driven workflow.

Before implementing code changes:

1. consult architecture documentation
2. check relevant ADRs
3. follow the feature workflow
4. verify documentation requirements

Relevant documents:

docs/governance/AGENTIC-WORKFLOW.md  
docs/governance/DEFINITION-OF-DONE.md  
docs/architecture/ARCHITECTURE-REQUIREMENTS.md  
docs/adr/ADR-INDEX.md  

---

# 3. Architecture Rules

Architecture integrity must be preserved.

Rules:

- follow the project structure
- respect module boundaries
- avoid cross-layer violations
- require ADRs for architecture decisions
- do not introduce undocumented structural changes

Authoritative sources:

docs/architecture/  
docs/adr/

---

# 4. Starter Installation

Architecture modules are installed via official starters.

Starter installation must:

- follow starter.manifest.yaml
- install runtime starters into official runtime paths
- avoid overwriting existing files
- detect and report collisions
- validate project structure after installation

Foundation starters use manual-adoption guidance and must not be forced into runtime `app/*` slots.

Starter ecosystem documentation:

docs/platform/STARTER-ECOSYSTEM.md  
docs/architecture/STARTER-PACKS.md  

Starter installation is handled by the **starter-installer agent**.

---

# 5. AI Agents

This repository includes specialized development agents.

Agents coordinate development responsibilities such as:

- project assembly
- feature workflow
- architecture validation
- documentation review
- testing strategy
- UX validation
- domain modeling

Agent responsibilities are defined in:

docs/platform/AGENT-RESPONSIBILITIES.md

---

# 6. Agent Routing

Requests should be routed to the appropriate agent.

Routing rules are defined in:

docs/routing/AGENT-ROUTING.md

Concrete request examples are defined in:

docs/routing/REQUEST-PATTERNS.md

---

# 7. Documentation Routing

Documentation responsibilities and authoritative sources are defined in:

docs/routing/ROUTING-MAP.md

Agents should consult this map before selecting documentation sources.

---

# 8. Development Workflow

Typical development sequence:

1. feature-orchestrator  
   interprets feature requests

2. architecture-guardian  
   evaluates architecture impact

3. domain-template-agent  
   proposes domain structures if needed

4. test-designer  
   defines testing strategy

5. ux-navigator  
   validates UX implications

6. documentation-guardian  
   ensures documentation completeness

---

# 9. General Copilot Behavior

When assisting in this repository:

- prefer minimal and deterministic changes
- follow documented workflows
- consult authoritative documentation
- respect agent responsibilities
- avoid inventing architecture patterns not present in the documentation
- explain conflicts or uncertainties clearly

---

Release readiness evaluation is defined in: docs/governance/RELEASE-CHECKLIST.md


Copilot should prioritize documentation sources defined in the routing system.
