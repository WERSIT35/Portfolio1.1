Update portfolio content safely in `src/app/data/portfolio-content.ts`.

Rules:
- Keep object shape consistent with interfaces in `src/app/interfaces`.
- Keep existing IDs stable unless explicitly asked to change them.
- Do not rename keys without updating all consumers.
- Preserve formatting and nearby style conventions.
- Make only requested content changes.

Validation:
- Confirm changed entries and fields.
- Note any required interface/service/component follow-up.

Output format:
1. What content was updated
2. Changed files
3. Data-shape compatibility check
4. Quick verification steps
