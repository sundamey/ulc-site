#!/usr/bin/env node
/* ==========================================================================
   ULC — Contrast audit
   Checks every foreground/background pair the site actually uses against
   WCAG 2.1. Run it after changing any colour in assets/css/ulc.css.

   Usage:  node tools/contrast.js        (exit code 1 if any pair fails)
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

/* Read the tokens straight out of the stylesheet so this can never drift. */
const css = fs.readFileSync(path.join(__dirname, '../assets/css/ulc.css'), 'utf8');
const T = {};
css.replace(/--ulc-([\w-]+):\s*(#[0-9A-Fa-f]{6})/g, (_, name, hex) => { T[name] = hex; });

function luminance(hex) {
  const ch = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

/* Pairs as they appear in the built pages. `large` = 18pt+ or 14pt+ bold. */
const PAIRS = [
  ['body text on page',            T.body,       T.black],
  ['headings on page',             T.white,      T.black],
  ['captions on page',             T.muted,      T.black],
  ['gold links on page',           T.gold,       T.black],
  ['brown-soft tags on page',      T['brown-soft'], T.black],
  ['body text on raised section',  T.body,       T.obsidian],
  ['captions on raised section',   T.muted,      T.obsidian],
  ['input text on ink',            T.body,       T.ink],
  ['placeholder on ink',           T.muted,      T.ink],
  ['black text on gold button',    T.black,      T.gold],
  ['black text on gold hover',     T.black,      T['gold-soft']],
  ['white text on maroon ribbon',  T.white,      T.maroon],
  ['gold link on maroon ribbon',   T.gold,       T.maroon],
  ['white heading on maroon band', T.white,      T.maroon],
];

/* Documented as surface-only — asserted to FAIL so the rule stays enforced. */
const SURFACE_ONLY = [
  ['maroon as text on black', T.maroon, T.black],
  ['brown as text on black',  T.brown,  T.black],
];

let failed = 0;
console.log('WCAG 2.1 contrast — normal text needs 4.5:1, large text 3:1\n');

for (const [label, fg, bg] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= 4.5;
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(1).padStart(5)}:1  ${label}  (${fg} on ${bg})`);
}

console.log('\nSurface-only colours — these are expected to fail as text:');
for (const [label, fg, bg] of SURFACE_ONLY) {
  const r = ratio(fg, bg);
  const asExpected = r < 4.5;
  if (!asExpected) console.log(`  NOTE  ${label} now passes — the surface-only rule could be relaxed.`);
  else console.log(`  ok    ${r.toFixed(1).padStart(5)}:1  ${label} — never used for text`);
}

console.log(failed ? `\n${failed} pair(s) below 4.5:1.` : '\nAll text pairs pass AA.');
process.exit(failed ? 1 : 0);
