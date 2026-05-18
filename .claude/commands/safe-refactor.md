Perform a safe refactor for the requested target only.

Rules:
- Refactor only the files directly related to the request.
- Preserve existing behavior unless a behavior change is explicitly requested.
- Keep API contracts and route/data keys stable.
- Prefer readability and small diffs over broad rewrites.
- Do not add dependencies.
- Do not touch unrelated files.

Required checks:
- Run relevant TypeScript/Angular checks if available.
- If tests are not run, state that explicitly.

Output format:
1. Refactor intent (1-2 lines)
2. Changed files
3. Behavior-safety notes
4. Verification run and result
5. Residual risks (if any)
