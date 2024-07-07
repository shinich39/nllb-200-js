import { Py } from "./src/py.js";

// https://huggingface.co/facebook/nllb-200-distilled-600M/blob/main/README.md?code=true
// https://github.com/facebookresearch/flores/blob/main/flores200/README.md
import LANGS from "./langs/flores.json" assert { type: "json" };

const MAIN_PATH = "src/main.py";
const py = new Py(".");

/**
 * https://huggingface.co/facebook
 */
const MODELS = [
  "facebook/nllb-200-distilled-600M",
  "facebook/nllb-200-distilled-1.3B",
  "facebook/nllb-200-1.3B",
  "facebook/nllb-200-3.3B",
  "facebook/nllb-moe-54b",
];

function isValidLanguage(str) {
  return Object.keys(LANGS).indexOf(str) > -1;
}

function convertLanguage(str) {
  return LANGS[str];
}

function isValidModel(str) {
  return MODELS.indexOf(str) > -1;
}

/**
 *
 * @param {boolean} force
 * @returns {Promise<void>}
 */
async function init(force) {
  await py.init(force);
  await py.install("torch", [
    "--index-url",
    "https://download.pytorch.org/whl/cu118",
  ]);
  await py.install("transformers");
}

/**
 *
 * @param {string} text
 * @param {string} from eng_Latn
 * @param {string} to jpn_Jpan
 * @param {string} model default "facebook/nllb-200-distilled-600M"
 * @returns {Promise<string>}
 */
async function translate(text, from, to, model) {
  if (!model) {
    model = MODELS[0]; // facebook/nllb-200-distilled-600M
  }
  if (!isValidLanguage(from)) {
    throw new Error(`${from} is invalid language.`);
  }
  if (!isValidLanguage(to)) {
    throw new Error(`${to} is invalid language.`);
  }
  if (!isValidModel(model)) {
    throw new Error(`${model} is invalid model.`);
  }

  from = convertLanguage(from);
  to = convertLanguage(to);

  const { stdout, stderr } = await py.exec(MAIN_PATH, [model, text, from, to]);
  if (stdout === "" && stderr.length > 0) {
    throw new Error(stderr);
  }
  return stdout;
}

export { MODELS, init, translate };
