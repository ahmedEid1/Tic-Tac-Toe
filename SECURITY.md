# Security Policy

## Supported Versions

This is a single-page static web application with no server-side component and no user data storage beyond the locally-persisted language preference (`localStorage`). The deployed site is the `main` branch.

## Reporting a Vulnerability

If you discover a security issue — for example, a way to inject script through
the Arabic translation strings, a misconfigured static asset, or an XSS path
through user-controlled input — please **do not** open a public issue.

Instead, open a [private security advisory](https://github.com/ahmedEid1/Tic-Tac-Toe/security/advisories/new) on this repo. We'll respond within a few days and credit you in the fix.

## Scope

In scope:
- The deployed application at <https://ahmedeid1.github.io/Tic-Tac-Toe/>
- The code in this repository
- The build and deploy workflows under `.github/workflows/`

Out of scope:
- Issues in upstream dependencies (please report those to their maintainers)
- Vulnerabilities that require physical access to a user's device
- Self-XSS via browser devtools
