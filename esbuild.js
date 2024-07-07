import fs from "node:fs";
import * as esbuild from "esbuild";

(async function () {
  const MODULE_NAME = "nllb-200";
  const OUTPUT_PATH = "dist";

  // Clear ./dist
  fs.rmSync(OUTPUT_PATH, { recursive: true, force: true });

  // ESM
  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: false,
    platform: "node",
    format: "esm",
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.mjs`,
  });

  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: true,
    platform: "node",
    format: "esm",
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.min.mjs`,
  });

  // CommonJS
  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: false,
    platform: "node",
    format: "cjs",
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.cjs`,
  });

  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: true,
    platform: "node",
    format: "cjs",
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.min.cjs`,
  });

  // Browser
  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: false,
    platform: "browser",
    format: "iife",
    globalName: MODULE_NAME,
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.js`,
  });

  await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: true,
    platform: "browser",
    format: "iife",
    globalName: MODULE_NAME,
    outfile: `${OUTPUT_PATH}/${MODULE_NAME}.min.js`,
  });
})();
