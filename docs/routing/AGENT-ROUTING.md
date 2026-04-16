# Agent Routing

This document defines how development requests should be routed to the appropriate AI agents in the Agentic development platform.

The goal is to ensure that each request is handled by the agent responsible for that area of expertise.

This routing system works together with:

docs/platform/AGENT-RESPONSIBILITIES.md  
docs/routing/ROUTING-MAP.md  
docs/routing/REQUEST-PATTERNS.md  

---

# 1. Routing Principles

Each request must be handled by a **primary agent**.

Other agents may assist as **supporting agents** if the request affects multiple areas.

Agents should not override responsibilities owned by another agent.

---

# 2. Agent Ownership

The following agents own specific responsibilities.

starter-installer

Responsible for:

- starter installation
- project assembly
- verifying project structure

---

feature-orchestrator

Responsible for:

- feature lifecycle management
- feature planning
- high-level workflow coordination across specialized feature agents

---

new-feature-agent

Responsible for:

- feature initialization
- canonical lifecycle skeleton creation under docs/features
- enforcing kebab-case feature slug naming

---

feature-lifecycle-agent

Responsible for:

- lifecycle validation for existing features
- transition rule enforcement
- reporting current stage, gaps, and next allowed step

---

feature-implementer

Responsible for:

- implementing approved features
- executing implementation increments
- producing implementation evidence and test execution results

---

architecture-guardian

Responsible for:

- architecture integrity
- ADR decisions
- structural validation

---

documentation-guardian

Responsible for:

- documentation completeness
- documentation quality
- release documentation readiness

---

test-designer

Responsible for:

- testing strategies
- testability validation
- Definition of Done from testing perspective

---

ux-navigator

Responsible for:

- UX consistency
- navigation validation
- user journey coherence

---

domain-template-agent

Responsible for:

- domain modeling templates
- bounded context structure
- domain entity design

---

# 3. Request Routing Table

Starter installation

Primary agent:

starter-installer

Supporting agents:

architecture-guardian
documentation-guardian

---

Feature initialization

Primary agent:

new-feature-agent

Supporting agents:

feature-orchestrator
documentation-guardian

---

Feature lifecycle validation

Primary agent:

feature-lifecycle-agent

Supporting agents:

feature-orchestrator
documentation-guardian
test-designer

---

Feature planning

Primary agent:

feature-orchestrator

Supporting agents:

architecture-guardian
test-designer
documentation-guardian
ux-navigator
domain-template-agent

---

Feature implementation

Primary agent:

feature-implementer

Supporting agents:

architecture-guardian
test-designer
documentation-guardian
ux-navigator (if user-facing)
domain-template-agent (if domain changes)

---

Architecture evaluation

Primary agent:

architecture-guardian

Supporting agents:

feature-orchestrator
domain-template-agent

---

Documentation review

Primary agent:

documentation-guardian

Supporting agents:

feature-orchestrator
architecture-guardian
test-designer

---

Bootstrap batch orchestration (prompts 00 to 09, strict-interactive mode)

Primary agent:

feature-orchestrator

Supporting agents:

project-auditor
starter-installer
architecture-guardian
documentation-guardian
new-feature-agent
feature-lifecycle-agent

---

Testing strategy

Primary agent:

test-designer

Supporting agents:

feature-orchestrator
architecture-guardian
ux-navigator

---

UX validation

Primary agent:

ux-navigator

Supporting agents:

feature-orchestrator
documentation-guardian

---

Domain modeling

Primary agent:

domain-template-agent

Supporting agents:

architecture-guardian
feature-orchestrator

---

# 4. Escalation Rules

Escalate to architecture-guardian when:

- a request modifies system structure
- a request may require an ADR
- module boundaries change
- feature-implementer must escalate when implementation changes module boundaries or may require an ADR.

Escalate to documentation-guardian when:

- documentation is incomplete
- release documentation must be validated

Escalate to test-designer when:

- acceptance criteria are unclear
- testing strategy is missing

Escalate to new-feature-agent when:

- a feature skeleton is missing under docs/features
- canonical lifecycle files are not initialized

Escalate to ux-navigator when:

- navigation changes
- user-facing interactions change

Escalate to domain-template-agent when:

- new domain concepts appear
- a new bounded context is introduced

---

# 5. Default Development Workflow

A typical feature request follows this sequence:

1 new-feature-agent (for new feature initialization)  
2 feature-lifecycle-agent (lifecycle pre-check and transition validation)  
3 feature-orchestrator (high-level coordination)  
4 feature-implementer  
5 architecture-guardian  
6 domain-template-agent (if domain changes exist)  
7 test-designer  
8 ux-navigator (if user-facing behavior changes)  
9 documentation-guardian  

A typical project assembly request follows this sequence:

1 starter-installer  
2 architecture-guardian  
3 documentation-guardian

---

# 6. Project audit and release-readiness review

Primary agent:

- project-auditor

Supporting agents:

- architecture-guardian
- documentation-guardian
- test-designer
- starter-installer
