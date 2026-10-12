// Builds one DOCX per variant in content.mjs into the repo root. export-pdf.ps1 then has Word
// embed the fonts and export the matching PDF. Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  Tab,
  TabStopType,
  TextRun,
  UnderlineType,
} from 'docx';
import {
  CERTS,
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  PERSON,
  PROJECTS,
  SKILLS,
  VARIANTS,
} from './content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// --- Page (A4, twips) -------------------------------------------------------------------
const PAGE = { width: 11906, height: 16838 };
const MARGIN = { top: 760, bottom: 760, left: 850, right: 850 };
const TEXT_W = PAGE.width - MARGIN.left - MARGIN.right;
const RIGHT_TAB = [{ type: TabStopType.RIGHT, position: TEXT_W }];

// --- Type & colour ----------------------------------------------------------------------
const FONT = 'Segoe UI';
const FONT_SEMI = 'Segoe UI Semibold';
const C = {
  ink: '161616',
  body: '2E2E2E',
  muted: '6B6B6B',
  faint: '9A9A9A',
  rule: 'D6D6D6',
  accent: '0F766E',
  linkLine: 'B8B8B8',
};
// Half-points.
const S = {
  name: 50,
  headline: 22,
  contact: 17,
  label: 16,
  role: 20,
  meta: 17,
  body: 19,
  summary: 20,
};

const run = (text, o = {}) =>
  new TextRun({
    text,
    font: o.semi ? FONT_SEMI : FONT,
    size: o.size ?? S.body,
    color: o.color ?? C.body,
    ...o.extra,
  });

// **x** = emphasis (semibold ink), [label](url) = link (body colour, faint underline).
function rich(text, base = {}) {
  const out = [];
  for (const part of text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)) {
    if (!part) continue;
    const strong = part.match(/^\*\*([^*]+)\*\*$/);
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (strong) out.push(run(strong[1], { ...base, semi: true, color: C.ink }));
    else if (link) out.push(linkRun(link[1], link[2], base));
    else out.push(run(part, base));
  }
  return out;
}

const linkRun = (label, url, base = {}) =>
  new ExternalHyperlink({
    link: url,
    children: [
      run(label, {
        ...base,
        extra: { underline: { type: UnderlineType.SINGLE, color: C.linkLine } },
      }),
    ],
  });

const dot = (size = S.contact) => run('  ·  ', { size, color: C.faint });

// --- Blocks -----------------------------------------------------------------------------
function header(v) {
  // Location + reach on one line, links on the next (nothing wraps mid-link).
  const contact = [
    run(PERSON.location, { size: S.contact, color: C.muted }),
    dot(),
    run(PERSON.availability, { size: S.contact, color: C.muted }),
    dot(),
    linkRun(PERSON.phone, `tel:${PERSON.phone.replace(/\s/g, '')}`, {
      size: S.contact,
      color: C.ink,
    }),
    dot(),
    linkRun(PERSON.email, `mailto:${PERSON.email}`, { size: S.contact, color: C.ink }),
  ];
  const reach = PERSON.links.flatMap((l, i) => [
    ...(i ? [dot()] : []),
    linkRun(l.label, l.url, { size: S.contact, color: C.ink }),
  ]);

  return [
    new Paragraph({
      spacing: { after: 20 },
      children: [
        run(PERSON.name, {
          semi: true,
          size: S.name,
          color: C.ink,
          extra: { characterSpacing: -12 },
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 110 },
      children: [run(v.headline, { semi: true, size: S.headline, color: C.accent })],
    }),
    new Paragraph({ spacing: { after: 30 }, children: contact }),
    new Paragraph({ spacing: { after: 0 }, children: reach }),
  ];
}

const sectionTitle = (label) =>
  new Paragraph({
    keepNext: true,
    spacing: { before: 230, after: 95 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 3 } },
    children: [
      run(label, { semi: true, size: S.label, color: C.accent, extra: { allCaps: true } }),
    ],
  });

const summary = (v) => [
  new Paragraph({
    spacing: { before: 200, after: 110, line: 284 },
    children: rich(v.summary, { size: S.summary, color: C.body }),
  }),
  new Paragraph({
    spacing: { after: 0, line: 276 },
    children: [
      run('Core  ', { semi: true, size: S.meta, color: C.accent, extra: { allCaps: true } }),
      ...v.core
        .split(' · ')
        .flatMap((item, i) => [
          ...(i ? [run('  ·  ', { size: S.meta, color: C.accent })] : []),
          run(item, { size: S.meta, color: C.ink }),
        ]),
    ],
  }),
];

const bullet = (text, last) =>
  new Paragraph({
    numbering: { reference: 'dot', level: 0 },
    keepLines: true,
    keepNext: !last,
    spacing: { after: last ? 0 : 32, line: 252 },
    children: rich(text),
  });

// Title line: left part, right-aligned dates (a real tab, so text extractors keep a gap).
const titleLine = (left, right, before) =>
  new Paragraph({
    keepNext: true,
    keepLines: true,
    tabStops: RIGHT_TAB,
    spacing: { before, after: 15 },
    children: [
      ...left,
      new TextRun({ children: [new Tab()] }),
      run(right, { size: S.meta, color: C.muted }),
    ],
  });

const metaLine = (text) =>
  new Paragraph({
    keepNext: true,
    keepLines: true,
    spacing: { after: 70, line: 252 },
    children: rich(text, { size: S.meta, color: C.muted }),
  });

function role(key, v, first) {
  const base = EXPERIENCE[key];
  const o = v.overrides?.[key];
  const bullets = o
    ? [...o.bullets, ...base.bullets.slice(o.keepFrom ?? base.bullets.length)]
    : base.bullets;
  const left = [run(base.role, { semi: true, size: S.role, color: C.ink })];
  if (base.org)
    left.push(
      run('  ·  ', { size: S.role, color: C.faint }),
      run(base.org, { size: S.role, color: C.ink }),
    );
  return [
    titleLine(left, base.dates, first ? 30 : 150),
    metaLine(base.meta),
    ...bullets.map((b, i) => bullet(b, i === bullets.length - 1)),
  ];
}

function project(key, first) {
  const p = PROJECTS[key];
  return [
    new Paragraph({
      keepNext: true,
      keepLines: true,
      tabStops: RIGHT_TAB,
      spacing: { before: first ? 30 : 140, after: 20 },
      children: [
        run(p.name, { semi: true, size: S.role, color: C.ink }),
        run('  ·  ', { size: S.role, color: C.faint }),
        run(p.kind, { size: S.role, color: C.ink }),
        new TextRun({ children: [new Tab()] }),
        ...rich(p.links, { size: S.meta, color: C.muted }),
      ],
    }),
    new Paragraph({
      keepNext: true,
      keepLines: true,
      spacing: { after: 20, line: 252 },
      children: rich(p.text),
    }),
    new Paragraph({
      keepLines: true,
      spacing: { after: 0 },
      children: [run(p.stack, { size: S.meta, color: C.muted })],
    }),
  ];
}

const skillLine = ([label, items], first) =>
  new Paragraph({
    keepLines: true,
    spacing: { before: first ? 30 : 40, after: 0, line: 252 },
    indent: { left: 1880, hanging: 1880 },
    tabStops: [{ type: TabStopType.LEFT, position: 1880 }],
    children: [
      run(label, { semi: true, color: C.ink }),
      new TextRun({ children: [new Tab()] }),
      run(items),
    ],
  });

const plainRow = (left, right, first) =>
  new Paragraph({
    keepLines: true,
    tabStops: RIGHT_TAB,
    spacing: { before: first ? 30 : 40, after: 0, line: 252 },
    children: [
      ...left,
      new TextRun({ children: [new Tab()] }),
      run(right, { size: S.meta, color: C.muted }),
    ],
  });

// --- Document ---------------------------------------------------------------------------
function build(v) {
  const children = [...header(v), ...summary(v)];

  children.push(sectionTitle('Experience'));
  v.experience.forEach((key, i) => children.push(...role(key, v, i === 0)));

  children.push(sectionTitle('Selected projects'));
  v.projects.forEach((key, i) => children.push(...project(key, i === 0)));

  children.push(sectionTitle('Skills'));
  v.skills.forEach((key, i) => children.push(skillLine(SKILLS[key], i === 0)));

  children.push(sectionTitle('Education'));
  EDUCATION.forEach((e, i) =>
    children.push(
      plainRow(
        [
          run(e.title, { semi: true, color: C.ink }),
          run('  ·  ', { color: C.faint }),
          run(e.school),
        ],
        e.dates,
        i === 0,
      ),
    ),
  );

  children.push(sectionTitle('Courses & certifications'));
  v.certs.forEach((key, i) => {
    const [issuer, names, year] = CERTS[key];
    children.push(
      plainRow(
        [run(issuer, { semi: true, color: C.ink }), run('  ·  ', { color: C.faint }), run(names)],
        year,
        i === 0,
      ),
    );
  });

  children.push(sectionTitle('Languages'));
  children.push(new Paragraph({ spacing: { before: 40 }, children: [run(LANGUAGES)] }));

  const footer = new Footer({
    children: [
      new Paragraph({
        tabStops: RIGHT_TAB,
        children: [
          run(`${PERSON.name}  ·  ${PERSON.email}  ·  ${PERSON.phone}`, {
            size: 15,
            color: C.faint,
          }),
          new TextRun({
            children: [new Tab(), 'Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
            font: FONT,
            size: 15,
            color: C.faint,
          }),
        ],
      }),
    ],
  });

  return new Document({
    creator: PERSON.name,
    lastModifiedBy: PERSON.name,
    title: `${PERSON.name} — CV`,
    subject: v.headline,
    description: v.summary,
    keywords: v.core.split(' · ').join(', '),
    styles: {
      default: {
        document: {
          run: { font: FONT, size: S.body, color: C.body, language: { value: 'en-GB' } },
          paragraph: { spacing: { line: 264 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'dot',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 250, hanging: 190 } },
                run: { color: C.accent, font: FONT },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          titlePage: true,
          page: { size: PAGE, margin: { ...MARGIN, footer: 420, header: 400 } },
        },
        footers: { default: footer, first: new Footer({ children: [new Paragraph({})] }) },
        children,
      },
    ],
  });
}

for (const v of VARIANTS) {
  const file = path.join(ROOT, `Otar-Davitashvili-CV-${v.slug}.docx`);
  fs.writeFileSync(file, await Packer.toBuffer(build(v)));
  console.log('wrote', path.relative(ROOT, file));
}
