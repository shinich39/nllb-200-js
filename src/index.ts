'use strict';

import _lang101 from './models/flores-101.json';
import _lang200 from './models/flores-200.json';
import _langIso from './models/flores-iso.json';
import models from './models/nllb-200.json';
import { PyWrapper } from 'node-py-wrapper';
import fs from 'node:fs';
import pyScript from './scripts/nllb-200';

const SCRIPT_PATH = './venv/nllb-200.py';
const lang101: Record<string, string> = _lang101;
const lang200: Record<string, string> = _lang200;
const langIso: { country: string; iso: string; flores: string }[] = _langIso;
const py = new PyWrapper({ venvPath: 'venv' });
let isTorchInstalled = false;
let isTransformersInstalled = false;

function chkScript() {
  if (!fs.existsSync(SCRIPT_PATH)) {
    fs.writeFileSync(SCRIPT_PATH, pyScript, 'utf8');
  }
}

export function getLang(str: string): string | undefined {
  if (lang200[str]) {
    return lang200[str];
  }

  if (lang101[str]) {
    return lang101[str];
  }

  const iso = langIso.find((item) => item.country === str || item.iso === str);
  if (iso) {
    return iso.flores;
  }
}
/**
 *
 * @param text
 * @param from
 * @param to
 * @param model
 * "facebook/nllb-200-distilled-600M",
 * "facebook/nllb-200-distilled-1.3B",
 * "facebook/nllb-200-1.3B",
 * "facebook/nllb-200-3.3B",
 * "facebook/nllb-moe-54b"
 */
export async function translate(
  from: string,
  to: string,
  text: string,
  model?: string
) {
  if (!py.isInitialized()) {
    await py.init();
  }

  if (!isTorchInstalled) {
    if (await py.isInstalled('torch')) {
      isTorchInstalled = true;
    } else {
      await py.install(
        'torch',
        '--index-url',
        'https://download.pytorch.org/whl/cu118'
      );
    }
  }

  if (!isTransformersInstalled) {
    if (await py.isInstalled('transformers')) {
      isTransformersInstalled = true;
    } else {
      await py.install('transformers');
    }
  }

  chkScript();

  const m: string | undefined = model || models[0];
  if (!m) {
    throw new Error(`Model not found`);
  }

  const f = getLang(from);
  if (!f) {
    throw new Error(`Language not supported: ${from}`);
  }

  const t = getLang(to);
  if (!t) {
    throw new Error(`Language not supported: ${to}`);
  }

  return await py.run(SCRIPT_PATH, m, f, t, text);
}
