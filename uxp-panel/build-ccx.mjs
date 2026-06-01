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
const runtimeItems = [
  'manifest.json',
  'index.html',
  'main.js',
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
  const version = manifest.version || '0.0.0';
  const sanitizedVersion = sanitizeVersion(version);
  const ccxPath = path.join(buildRoot, `InDesignBrot-uxp-panel-${sanitizedVersion}.ccx`);

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

  console.log(`Created CCX archive: ${ccxPath}`);
}

main();