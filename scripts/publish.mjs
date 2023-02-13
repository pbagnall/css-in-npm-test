#!/usr/bin/env node
import fs from 'fs';

fs.copyFileSync("LICENSE", "dist/LICENCE");
fs.copyFileSync("package_README.md", "dist/README.md");
const pkg = JSON.parse(fs.readFileSync("package.json", 'utf8'));

const excludePackageKeys = new Set([
  'scriptsComments',
  'scripts',
  'devDependencies',
  'files',
  'config'
]);

fs.writeFileSync("dist/package.json", JSON.stringify(pkg, (key, value) => {
  return excludePackageKeys.has(key) ? void(0) : value;
}, 2));
