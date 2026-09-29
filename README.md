# David Budha Magar — Cybersecurity Portfolio

A lightweight, responsive portfolio built with semantic HTML, CSS, and vanilla JavaScript. The 3D-inspired hero uses a small canvas network and CSS geometry, with a low-motion mode for visitors who request reduced motion.

## Run locally

Open `index.html` directly, or serve this directory with any static web server. No build step or runtime dependencies are required.

## Before publishing

- Confirm the contact email, experience wording, qualification, and credential names against primary records.
- Add verified LinkedIn and GitHub profile URLs, credential verification URLs and years, and the actual CV PDF if you want a download action.
- The GitHub and LinkedIn links now point to the supplied profiles. Project cards link to the matching public repositories; review their README files for exact scope and capabilities.
- Configure hosting-level HTTPS, security headers, request controls, and logging as appropriate for the selected host.
- Update the canonical domain and sitemap if deployment uses another origin.

## Architecture and security scope

This repository is a static public portfolio. It does not collect data through a form, create visitor accounts, store credentials, or provide an admin dashboard. No database, authentication, private API, or analytics integration is configured. Those features need an actual deployment environment, owner credentials, data-retention decisions, and protected server-side services; the static experience does not imply that these services exist.

`robots.txt` contains crawler preferences only and does not protect routes. The security page describes general principles and does not make claims about unconfigured infrastructure. There is no CV or verified credential URL in the supplied workspace, so none is fabricated.

## Files

- `index.html` — portfolio landing page and project dialog
- `styles.css` — responsive design system, layouts, animation, reduced-motion rules
- `script.js` — navigation, disclosure controls, project details, canvas visualization
- `security.html` — security philosophy and responsible disclosure
- `arcade.html` and `arcade.js` — ten fixed, local cybersecurity learning challenges
- `robots.txt` and `sitemap.xml` — public crawler metadata

The arcade is deliberately a defensive quiz: it has no target field, payload execution, network access, or answer persistence. It is not an intentionally vulnerable app or substitute for an isolated authorized training lab.

