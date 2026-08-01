#!/usr/bin/env node
/* ==========================================================================
   ULC — Netlify preflight
   Answers one question: will Netlify find what it needs at the repository
   root? Run it from inside your Git repo BEFORE pushing.

   Usage:  node tools/preflight.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return null;
  }
}

const problems = [];
const notes = [];

/* 1 · Are we in a Git repo at all? ---------------------------------------- */
const repoRoot = git(['rev-parse', '--show-toplevel']);
if (!repoRoot) {
  console.log('Not inside a Git repository.\n');
  console.log('If you are deploying by drag-and-drop this check does not apply —');
  console.log('run `npm run build` and drop the dist/ folder instead.\n');
  console.log('To set up Git:  git init && git add . && git commit -m "ULC site"');
  process.exit(0);
}

const projectDir = process.cwd();
const rel = path.relative(repoRoot, projectDir) || '.';

console.log('Repository root : ' + repoRoot);
console.log('Project folder  : ' + (rel === '.' ? '(repository root)' : rel));
console.log('');

/* 2 · Is the project at the repo root? ------------------------------------ */
if (rel !== '.') {
  problems.push(
    'The project sits in a subfolder of the repository ("' + rel + '").\n' +
    '      Netlify looks for package.json at the repository root by default.\n' +
    '      Fix EITHER by moving the files up:\n' +
    '        cd ' + repoRoot + ' && git mv ' + rel + '/* ' + rel + '/.[!.]* . && git commit -am "Move site to repo root"\n' +
    '      OR by telling Netlify where to look — add this to a netlify.toml\n' +
    '      at the REPOSITORY ROOT (not inside ' + rel + '):\n' +
    '        [build]\n' +
    '          base = "' + rel + '/"\n' +
    '          command = "npm run build"\n' +
    '          publish = "dist"'
  );
}

/* 3 · Are the build-critical files actually committed? --------------------- */
// --full-name forces repo-root-relative paths; plain `git ls-files` returns
// paths relative to the CURRENT directory, which silently breaks this check
// when the project sits in a subfolder — exactly the case we're diagnosing.
const tracked = new Set((git(['ls-files', '--full-name', ':/']) || '').split('\n').filter(Boolean));
const prefix = rel === '.' ? '' : rel.split(path.sep).join('/') + '/';

const REQUIRED = [
  ['package.json',            'npm cannot run any script without it — this is the file Netlify reported missing'],
  ['netlify.toml',            'build command and publish directory'],
  ['index.html',              'the site itself'],
  ['tailwind.config.js',      'the production CSS build reads this'],
  ['netlify/_headers',        'security and caching headers'],
  ['netlify/_redirects',      'friendly URLs'],
  ['assets/css/ulc.css',      'component stylesheet'],
  ['assets/js/i18n.js',       'all site copy'],
  ['assets/img/ulc-logo.png', 'the crest'],
];

const missing = REQUIRED.filter(([f]) => !tracked.has(prefix + f));
if (missing.length) {
  problems.push(
    'These files exist on disk but are NOT committed to Git:\n' +
    missing.map(([f, why]) => '        ' + f + '  — ' + why).join('\n') +
    '\n      Netlify only ever sees committed files. Fix:\n' +
    '        git add -A && git commit -m "Add site files" && git push'
  );
}

/* 4 · Is anything needed being ignored? ------------------------------------ */
for (const [f] of REQUIRED) {
  const onDisk = fs.existsSync(path.join(projectDir, f));
  const ignored = git(['check-ignore', f]);
  if (onDisk && ignored) {
    problems.push('.gitignore is excluding "' + f + '", which the build needs. Remove that rule.');
  }
}

/* 5 · Things that should NOT be committed --------------------------------- */
// GitHub's web uploader silently drops dotfiles, so .gitignore often goes
// missing. Without it, `npm install` followed by `git add .` commits 133
// dependency folders — slow, noisy, and awkward to undo.
const ignoreFile = path.join(projectDir, '.gitignore');
const ignoreText = fs.existsSync(ignoreFile) ? fs.readFileSync(ignoreFile, 'utf8') : '';

if (!fs.existsSync(ignoreFile)) {
  problems.push(
    '.gitignore is missing. It was in the delivered files — GitHub\'s web\n' +
    '      uploader drops files whose names start with a dot.\n' +
    '      Without it, `npm install` then `git add .` commits thousands of\n' +
    '      dependency files. Recreate it:\n' +
    '        printf \'node_modules/\\ndist/\\n\' > .gitignore\n' +
    '        git add .gitignore && git commit -m "Add gitignore"'
  );
} else {
  if (!/^\s*node_modules\/?\s*$/m.test(ignoreText)) {
    problems.push('.gitignore does not list node_modules/ — add that line.');
  }
  if (!/^\s*dist\/?\s*$/m.test(ignoreText)) {
    notes.push('.gitignore does not list dist/. Netlify builds dist itself, so it need not be committed.');
  }
}

if ([...tracked].some((f) => f.startsWith(prefix + 'node_modules/'))) {
  problems.push(
    'node_modules/ has been committed (' +
    [...tracked].filter((f) => f.startsWith(prefix + 'node_modules/')).length +
    ' files). Remove it from Git — it stays on disk:\n' +
    '        git rm -r --cached node_modules && git commit -m "Remove node_modules"'
  );
}

/* 6 · Does netlify.toml agree with package.json? --------------------------- */
if (fs.existsSync('package.json') && fs.existsSync('netlify.toml')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const toml = fs.readFileSync('netlify.toml', 'utf8');
  const cmd = (toml.match(/command\s*=\s*"([^"]+)"/) || [])[1];
  if (cmd && cmd.startsWith('npm run ')) {
    const script = cmd.slice(8).trim();
    if (!pkg.scripts || !pkg.scripts[script]) {
      problems.push('netlify.toml runs "' + cmd + '" but package.json has no "' + script + '" script.');
    }
  }
  if (!/publish\s*=\s*"dist"/.test(toml)) {
    notes.push('netlify.toml publish directory is not "dist" — confirm that is intended.');
  }
}

/* 7 · Report --------------------------------------------------------------- */
if (problems.length === 0) {
  console.log('PASS — Netlify will find package.json and netlify.toml at the repo root.');
  if (notes.length) {
    console.log('\nNotes:');
    notes.forEach((n) => console.log('  - ' + n));
  }
  console.log('\nPush, and the build should run.');
  process.exit(0);
}

console.log(problems.length + ' problem(s) found:\n');
problems.forEach((p, i) => console.log('  ' + (i + 1) + '. ' + p + '\n'));
if (notes.length) {
  console.log('Notes:');
  notes.forEach((n) => console.log('  - ' + n));
  console.log('');
}
process.exit(1);
