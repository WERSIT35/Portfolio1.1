# CV generator

Builds the CV variants from one content file, kept out of the app build.

```sh
cd scripts/cv && npm install          # once
node build.mjs                        # writes Otar-Davitashvili-CV-<variant>.docx to the repo root
powershell -File export-pdf.ps1 ../../Otar-Davitashvili-CV-iGaming.docx ../../Otar-Davitashvili-CV-Founding-Engineer.docx
```

`export-pdf.ps1` drives Microsoft Word (needs Word on Windows): it exports a tagged A4 PDF with
embedded fonts next to each DOCX and prints the page count (both variants must stay at 2 pages).

- `content.mjs` is the only place to edit text. Facts only: `src/app/data/site-data.ts` (audited
  against the GitHub repos), the repos, and the owner's confirmed answers. Markup: `**x**` emphasis,
  `[label](url)` link.
- Variants: `iGaming` (targeted applications) and `Founding-Engineer` (general; the site's
  "Download CV"). After changing the general one, copy its PDF to
  `public/assets/me/Otar-Davitashvili-CV.pdf` and `public/assets/me/OTAR DAVITASHVILI.pdf` (old URL).
- ATS rules the layout follows: single column, real text, standard tab stops for the right-aligned
  dates, no letter-spaced headings (they extract as "E X P E R I E N C E").

`evidence/lumina-rgs-load-test.ts` is the load test behind the Lumina Games numbers (run it inside the Provider repo's
`platform/`, see its header).
