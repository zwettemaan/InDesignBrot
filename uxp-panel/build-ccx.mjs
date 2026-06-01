#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const panelRoot = path.dirname(scriptPath);
const buildRoot = path.join(panelRoot, 'build');
const stageRoot = path.join(buildRoot, 'ccx-stage');
const ccxStageDir = path.join(stageRoot, 'indesignbrot-uxp-panel');
const versionFilePath = path.join(panelRoot, 'version.txt');
const runtimeItems = [
  'manifest.json',
  'index.html',
  'main.js',
  'icons',
  'runtime',
];

function sanitizeVersion(value) {
  return String(value)
    .trim()
    .replace(/[^a-z0-9._-]+/gi, '-')
    .replace(/-+/g, '-');
}

function copyRecursive(sourcePath, targetPath) {
  const stat = fs.statSync(sourcePath);

  if (stat.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function zipContents(sourceDir, zipPath) {
  const result = spawnSync('zip', ['-qry', zipPath, '.'], {
    cwd: sourceDir,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(path.join(panelRoot, 'manifest.json'), 'utf8'));
}

function parseVersionState(rawText) {
  const state = {
    version: undefined,
    build: undefined,
  };

  for (const rawLine of String(rawText).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (key === 'version') {
      state.version = value;
      continue;
    }

    if (key === 'build') {
      state.build = value;
    }
  }

  return state;
}

function readVersionState(defaultVersion) {
  if (!fs.existsSync(versionFilePath)) {
    return {
      version: defaultVersion,
      build: 0,
    };
  }

  const parsedState = parseVersionState(fs.readFileSync(versionFilePath, 'utf8'));
  const version = parsedState.version || defaultVersion;
  const build = Number.parseInt(parsedState.build || '0', 10);

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid version in ${versionFilePath}: ${version}`);
  }

  if (!Number.isInteger(build) || build < 0) {
    throw new Error(`Invalid build number in ${versionFilePath}: ${parsedState.build}`);
  }

  return {
    version,
    build,
  };
}

function writeVersionState(versionState) {
  fs.writeFileSync(
    versionFilePath,
    `version=${versionState.version}\nbuild=${versionState.build}\n`,
    'utf8'
  );
}

function getNextBuildVersion(defaultVersion) {
  const versionState = readVersionState(defaultVersion);
  const nextState = {
    version: versionState.version,
    build: versionState.build + 1,
  };

  writeVersionState(nextState);

  return {
    baseVersion: nextState.version,
    buildNumber: nextState.build,
    packageVersion: `${nextState.version}.${nextState.build}`,
  };
}

function buildProductionManifest(manifest) {
  if (Array.isArray(manifest.host) && manifest.host.length > 0) {
    return {
      ...manifest,
      host: manifest.host[0],
    };
  }

  return manifest;
}

function main() {
  const manifest = buildProductionManifest(loadManifest());
  const buildVersion = getNextBuildVersion(manifest.version || '0.0.0');
  const sanitizedVersion = sanitizeVersion(buildVersion.packageVersion);
  const ccxPath = path.join(buildRoot, `InDesignBrot-uxp-panel-${sanitizedVersion}.ccx`);

  manifest.version = buildVersion.baseVersion;

  fs.rmSync(stageRoot, { recursive: true, force: true });
  fs.rmSync(ccxPath, { force: true });
  fs.mkdirSync(ccxStageDir, { recursive: true });

  for (const item of runtimeItems) {
    const sourcePath = path.join(panelRoot, item);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing required runtime item: ${sourcePath}`);
    }

    copyRecursive(sourcePath, path.join(ccxStageDir, item));
  }

  fs.writeFileSync(
    path.join(ccxStageDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );

  fs.mkdirSync(buildRoot, { recursive: true });
  zipContents(ccxStageDir, ccxPath);

  console.log(`Built version: ${buildVersion.baseVersion}`);
  console.log(`Build number: ${buildVersion.buildNumber}`);
  console.log(`Created CCX archive: ${ccxPath}`);
}

main();