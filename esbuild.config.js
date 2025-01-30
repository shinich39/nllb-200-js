import fs from "node:fs";
import path from "node:path";
import * as esbuild from 'esbuild'
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

function camelize(str) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

const ESM = true;
const CJS = true;
const BROWSER = false;

const MODULE_NAME = pkg.name.replace(/\W/g, "-").replace(/[-.]?(js|ts)$/, "");
const MODULE_VERSION = pkg.version;
const GLOBAL_NAME = camelize(MODULE_NAME);

const ENTRY_POINTS = ["./src/index.ts"];
const OUTPUT_DIR = "./dist";
// https://esbuild.github.io/api/#external
const EXTERNAL = [];
const BUNDLE_PACKAGES = true;

if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

const options = [];

if (ESM) {
  options.push(
    {
      entryPoints: ENTRY_POINTS,
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      outfile: `${OUTPUT_DIR}/index.mjs`,
      external: EXTERNAL,
      ...(BUNDLE_PACKAGES ? {} : { packages: "external" }),
    },
    {
      entryPoints: ENTRY_POINTS,
      platform: BROWSER ? "browser" : "node",
      format: 'esm',
      bundle: true,
      minify: true,
      outfile: `${OUTPUT_DIR}/index.min.mjs`,
      external: EXTERNAL,
      ...(BUNDLE_PACKAGES ? {} : { packages: "external" }),
    },
  );
}

if (CJS) {
  options.push(
    {
      entryPoints: ENTRY_POINTS,
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      outfile: `${OUTPUT_DIR}/index.cjs`,
      external: EXTERNAL,
      ...(BUNDLE_PACKAGES ? {} : { packages: "external" }),
    },
    {
      entryPoints: ENTRY_POINTS,
      platform: BROWSER ? "browser" : "node",
      format: 'cjs',
      bundle: true,
      minify: true,
      outfile: `${OUTPUT_DIR}/index.min.cjs`,
      external: EXTERNAL,
      ...(BUNDLE_PACKAGES ? {} : { packages: "external" }),
    },
  );
}

if (BROWSER) {
  options.push(
    {
      entryPoints: ENTRY_POINTS,
      platform: "browser",
      format: "iife",
      globalName: GLOBAL_NAME,
      bundle: true,
      outfile: `${OUTPUT_DIR}/index.js`,
      external: EXTERNAL,
    },
    {
      entryPoints: ENTRY_POINTS,
      platform: "browser",
      format: "iife",
      globalName: GLOBAL_NAME,
      bundle: true,
      minify: true,
      outfile: `${OUTPUT_DIR}/index.min.js`,
      external: EXTERNAL,
    },
  );
}

for (const option of options) {
  await esbuild.build(option);
}