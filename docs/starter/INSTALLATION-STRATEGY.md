# Installation Strategy

## Purpose

This document describes realistic ways to consume AGENTIC-IAM in downstream repositories.

Authoritative supported consumption model: manual copy or subtree-style vendoring.

## Recommended Consumption Patterns

Recommended patterns for this starter are intentionally simple:

- copy-based adoption for selected files or folders
- subtree-style adoption when teams want to retain a visible upstream relationship
- manual promotion of starter content into project-owned documentation and backlog artifacts

## Practical Guidance

Because AGENTIC-IAM is documentation-first and architecture-agnostic, adoption is primarily a documentation and governance exercise rather than a runtime installation step.

Teams should:

1. copy the relevant domain, policy, and starter guidance files into the target repository
2. preserve terminology consistency unless an explicit decision justifies divergence
3. adapt the feature catalog into project planning artifacts
4. promote ADR seeds into approved project ADRs before implementation starts
5. map the domain baseline into runtime-specific work items in the appropriate canonical slots of the target project

## Current Platform Limitation

The current platform has canonical slots for backend, web, contracts, and similar runtime-oriented assets. Domain/foundation starters like AGENTIC-IAM therefore use manual adoption guidance as the authoritative model until a formalized platform pattern exists for documentation-first starters.

This repository does not claim an unsupported automatic installation guarantee.

## Why The Manifest Uses A Custom Starter Type

The starter manifest is descriptive metadata for publication and review. Its type and install values describe the intended manual-adoption posture of this repository and must be mapped to any stricter publication schema used by external tooling.

## Recommended Downstream Ownership Model

After adoption, the downstream project should own:

- its project-specific ADR decisions
- its runtime enforcement choices
- its authentication and authorization implementation
- any extensions to the baseline TenantRole or Permission model
