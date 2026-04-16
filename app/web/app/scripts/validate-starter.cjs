const fs = require('node:fs');
const path = require('node:path');

const cwd = process.cwd();

function exists(targetPath) {
  try {
    fs.accessSync(targetPath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function isDirectory(targetPath) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function resolveManifestCandidates(baseDir) {
  const roots = [baseDir, path.resolve(baseDir, '..'), path.resolve(baseDir, '../..')];
  const names = ['starter.manifest.yaml', 'starter.manifest.yml'];
  const candidates = [];

  for (const root of roots) {
    for (const name of names) {
      candidates.push(path.join(root, name));
    }
  }

  return candidates;
}

function findFirstExisting(paths) {
  for (const p of paths) {
    if (exists(p)) {
      return p;
    }
  }
  return null;
}

function toPosixRelative(baseDir, targetPath) {
  return path.relative(baseDir, targetPath).split(path.sep).join('/');
}

function hasTestArtifacts(baseDir) {
  const excludedDirs = new Set(['node_modules', 'dist', 'build', 'coverage', '.git']);
  const queue = [baseDir];

  while (queue.length > 0) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name)) {
          continue;
        }

        if (entry.name === 'tests' || entry.name === 'test' || entry.name === '__tests__') {
          return true;
        }

        queue.push(entryPath);
        continue;
      }

      if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name)) {
        return true;
      }
    }
  }

  return false;
}

function validate() {
  const errors = [];

  const manifestCandidates = resolveManifestCandidates(cwd);
  const manifestPath = findFirstExisting(manifestCandidates);
  if (!manifestPath) {
    const manifestOptions = manifestCandidates
      .map((p) => toPosixRelative(cwd, p))
      .sort();
    errors.push(
      [
        'Metadata starter mancante: atteso starter.manifest.yaml oppure starter.manifest.yml.',
        `Percorsi controllati: ${manifestOptions.join(', ')}`,
        'Azione: aggiungere il manifest nella root standard del repository.'
      ].join(' ')
    );
  }

  const packageJsonPath = path.join(cwd, 'package.json');
  let packageJson = null;
  if (!exists(packageJsonPath)) {
    errors.push('package.json mancante nella root del progetto npm (app). Azione: ripristinare package.json valido.');
  } else {
    try {
      packageJson = readJson(packageJsonPath);
    } catch (error) {
      errors.push(
        `package.json non valido: ${error.message}. Azione: correggere JSON e ripetere npm ci.`
      );
    }
  }

  const scripts = (packageJson && packageJson.scripts) || {};
  const hasBuildScript = typeof scripts.build === 'string' && scripts.build.trim().length > 0;
  const testScript = typeof scripts.test === 'string' ? scripts.test : '';
  const hasTestScript = testScript.trim().length > 0;

  const structuralIssues = [];
  const srcDir = path.join(cwd, 'src');
  if (!isDirectory(srcDir)) {
    structuralIssues.push('Directory src/ mancante.');
  }

  const explicitEntrypoints = [
    path.join(cwd, 'src', 'main.tsx'),
    path.join(cwd, 'src', 'main.jsx'),
    path.join(cwd, 'src', 'main.ts'),
    path.join(cwd, 'src', 'main.js')
  ];
  const resolvedEntrypoints = [];

  if (packageJson && typeof packageJson === 'object') {
    const candidateFields = ['main', 'module', 'source', 'browser'];
    for (const field of candidateFields) {
      if (typeof packageJson[field] === 'string' && packageJson[field].trim()) {
        const value = packageJson[field].trim();
        if (value.startsWith('./') || value.startsWith('src/')) {
          resolvedEntrypoints.push(path.resolve(cwd, value));
        }
      }
    }
  }

  const allEntrypoints = [...explicitEntrypoints, ...resolvedEntrypoints];
  if (!findFirstExisting(allEntrypoints)) {
    structuralIssues.push(
      'Entrypoint web mancante. Atteso src/main.tsx o src/main.jsx (oppure equivalente esplicito in package.json).'
    );
  }

  const htmlHosts = [path.join(cwd, 'index.html'), path.join(cwd, 'public', 'index.html')];
  if (!findFirstExisting(htmlHosts)) {
    structuralIssues.push('Host HTML mancante. Atteso index.html in root o public/index.html.');
  }

  if (hasBuildScript && structuralIssues.length > 0) {
    errors.push(
      [
        'Script build definito ma prerequisiti strutturali non soddisfatti:',
        structuralIssues.join(' '),
        'Azione: ripristinare struttura minima web prima di eseguire npm run build.'
      ].join(' ')
    );
  }

  if (!hasBuildScript && structuralIssues.length > 0) {
    errors.push(
      [
        'Struttura minima web incompleta:',
        structuralIssues.join(' '),
        'Azione: ripristinare struttura minima oppure rimuovere script che dipendono dal frontend web.'
      ].join(' ')
    );
  }

  if (hasTestScript) {
    const allowsNoTests = /passWithNoTests/i.test(testScript);
    if (!allowsNoTests && !hasTestArtifacts(cwd)) {
      errors.push(
        [
          'Script test definito senza passWithNoTests, ma nessun test artifact trovato.',
          'Azione: aggiungere almeno un file .test/.spec oppure una cartella tests prima di eseguire npm run test.'
        ].join(' ')
      );
    }
  }

  if (errors.length > 0) {
    console.error('Starter completeness validation failed.');
    for (const [index, message] of errors.entries()) {
      console.error(`${index + 1}. ${message}`);
    }
    process.exit(1);
  }

  console.log('Starter completeness validation passed.');
  if (manifestPath) {
    console.log(`Manifest detected: ${toPosixRelative(cwd, manifestPath)}`);
  }
}

validate();
