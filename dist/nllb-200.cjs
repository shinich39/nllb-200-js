var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var nllb_200_js_exports = {};
__export(nllb_200_js_exports, {
  MODELS: () => MODELS,
  init: () => init,
  translate: () => translate
});
module.exports = __toCommonJS(nllb_200_js_exports);

// src/py.js
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_child_process = require("node:child_process");
var PYTHON_FILENAME = "python.exe";
var PIP_FILENAME = "pip.exe";
function S(filePath, args) {
  return new Promise(function(resolve, reject) {
    let stdout = "";
    let stderr = "";
    const child = (0, import_node_child_process.spawn)(filePath, args);
    child.stdout.on("data", function(data) {
      stdout += data.toString();
    });
    child.stderr.on("data", function(data) {
      stderr += data.toString();
    });
    child.on("error", function(err) {
      reject(err);
    });
    child.on("exit", function(code, signal) {
      resolve({ stdout, stderr });
    });
  });
}
function chkDir(p) {
  if (!import_node_fs.default.existsSync(p)) {
    import_node_fs.default.mkdirSync(p);
  }
}
function rmDir(p) {
  if (import_node_fs.default.existsSync(p)) {
    import_node_fs.default.rmSync(p, { force: true, recursive: true });
  }
}
var Py = class {
  /**
   *
   * @param {string} installPath default "."
   */
  constructor(installPath) {
    this.__installPath__ = installPath || ".";
    this.__venvPath__ = import_node_path.default.join(installPath, "venv");
    this.__scriptsPath__ = import_node_path.default.join(installPath, "venv", "Scripts");
    this.__pythonPath__ = import_node_path.default.join(
      installPath,
      "venv",
      "Scripts",
      PYTHON_FILENAME
    );
    this.__pipPath__ = import_node_path.default.join(installPath, "venv", "Scripts", PIP_FILENAME);
    this.__isInitialized__ = this.isInitialized();
  }
};
Py.prototype.chkInit = function() {
  if (!this.__isInitialized__) {
    throw new Error("Py has not been initialized.");
  }
};
Py.prototype.isInitialized = function() {
  return import_node_fs.default.existsSync(this.__installPath__) && import_node_fs.default.existsSync(this.__venvPath__) && import_node_fs.default.existsSync(this.__scriptsPath__) && import_node_fs.default.existsSync(this.__pythonPath__) && import_node_fs.default.existsSync(this.__pipPath__);
};
Py.prototype.init = async function(force) {
  if (!this.__isInitialized__) {
    chkDir(this.__installPath__);
    if (force) {
      rmDir(this.__venvPath__);
    }
    chkDir(this.__venvPath__);
    await S("python", ["-m", "venv", this.__venvPath__]);
    this.__isInitialized__ = this.isInitialized();
    if (!this.__isInitialized__) {
      throw new Error("Can not create venv.");
    }
  }
};
Py.prototype.destory = async function() {
  rmDir(this.__venvPath__);
  this.__isInitialized__ = this.isInitialized();
};
Py.prototype.freeze = async function() {
  this.chkInit();
  const { stdout, stderr } = await S(this.__pipPath__, ["freeze"]);
  return stdout;
};
Py.prototype.getModules = async function() {
  return (await this.freeze()).replace(/\r\n/g, "\n").replace(/\n$/, "").split(/\n/).map(function(item) {
    return {
      name: item.split("==")[0],
      version: item.split("==")[1]
    };
  });
};
Py.prototype.install = async function(moduleName, args) {
  this.chkInit();
  const res = await S(
    this.__pipPath__,
    ["install", moduleName].concat(args || [])
  );
  return res;
};
Py.prototype.isInstalled = async function(moduleName) {
  this.chkInit();
  const { stdout, stderr } = await S(this.__pipPath__, ["freeze"]);
  const lines = stdout.replace(/\r\n/g, "\n").split(/\n/);
  for (const line of lines) {
    if (line.indexOf(moduleName) === 0) {
      return true;
    }
  }
  return false;
};
Py.prototype.exec = async function(scriptPath, args) {
  this.chkInit();
  const res = await S(this.__pythonPath__, [scriptPath].concat(args || []));
  return res;
};

// langs/flores.json
var flores_default = {
  afr: "afr_Latn",
  amh: "amh_Ethi",
  ara: "arb_Arab",
  asm: "asm_Beng",
  ast: "ast_Latn",
  azj: "azj_Latn",
  bel: "bel_Cyrl",
  ben: "ben_Beng",
  bos: "bos_Latn",
  bul: "bul_Cyrl",
  cat: "cat_Latn",
  ceb: "ceb_Latn",
  ces: "ces_Latn",
  ckb: "ckb_Arab",
  cym: "cym_Latn",
  dan: "dan_Latn",
  deu: "deu_Latn",
  ell: "ell_Grek",
  eng: "eng_Latn",
  est: "est_Latn",
  fin: "fin_Latn",
  fra: "fra_Latn",
  ful: "fuv_Latn",
  gle: "gle_Latn",
  glg: "glg_Latn",
  guj: "guj_Gujr",
  hau: "hau_Latn",
  heb: "heb_Hebr",
  hin: "hin_Deva",
  hrv: "hrv_Latn",
  hun: "hun_Latn",
  hye: "hye_Armn",
  ibo: "ibo_Latn",
  ind: "ind_Latn",
  isl: "isl_Latn",
  ita: "ita_Latn",
  jav: "jav_Latn",
  jpn: "jpn_Jpan",
  kam: "kam_Latn",
  kan: "kan_Knda",
  kat: "kat_Geor",
  kaz: "kaz_Cyrl",
  khm: "khm_Khmr",
  kir: "kir_Cyrl",
  kor: "kor_Hang",
  lao: "lao_Laoo",
  Latvian: "lij_Latn",
  kea: "lim_Latn",
  lin: "lin_Latn",
  lit: "lit_Latn",
  ltz: "ltz_Latn",
  lug: "lug_Latn",
  luo: "luo_Latn",
  lav: "lvs_Latn",
  mal: "mal_Mlym",
  mar: "mar_Deva",
  mkd: "mkd_Cyrl",
  mlt: "mlt_Latn",
  mon: "khk_Cyrl",
  mri: "mri_Latn",
  mya: "mya_Mymr",
  nld: "nld_Latn",
  nob: "nob_Latn",
  npi: "npi_Deva",
  nso: "nso_Latn",
  nya: "nya_Latn",
  oci: "oci_Latn",
  orm: "gaz_Latn",
  ory: "ory_Orya",
  pan: "pan_Guru",
  fas: "pes_Arab",
  pol: "pol_Latn",
  por: "por_Latn",
  pus: "pbt_Arab",
  ron: "ron_Latn",
  rus: "rus_Cyrl",
  slk: "slk_Latn",
  sna: "sna_Latn",
  snd: "snd_Arab",
  som: "som_Latn",
  spa: "spa_Latn",
  srp: "srp_Cyrl",
  swe: "swe_Latn",
  swh: "swh_Latn",
  tam: "tam_Taml",
  tel: "tel_Telu",
  tgk: "tgk_Cyrl",
  tgl: "tgl_Latn",
  tha: "tha_Thai",
  tur: "tur_Latn",
  ukr: "ukr_Cyrl",
  umb: "umb_Latn",
  urd: "urd_Arab",
  uzb: "uzn_Latn",
  vie: "vie_Latn",
  wol: "wol_Latn",
  xho: "xho_Latn",
  yor: "yor_Latn",
  zho_simpl: "zho_Hans",
  zho_trad: "zho_Hant",
  msa: "zsm_Latn",
  zul: "zul_Latn",
  afr_Latn: "afr_Latn",
  amh_Ethi: "amh_Ethi",
  arb_Arab: "arb_Arab",
  asm_Beng: "asm_Beng",
  ast_Latn: "ast_Latn",
  azj_Latn: "azj_Latn",
  bel_Cyrl: "bel_Cyrl",
  ben_Beng: "ben_Beng",
  bos_Latn: "bos_Latn",
  bul_Cyrl: "bul_Cyrl",
  cat_Latn: "cat_Latn",
  ceb_Latn: "ceb_Latn",
  ces_Latn: "ces_Latn",
  ckb_Arab: "ckb_Arab",
  cym_Latn: "cym_Latn",
  dan_Latn: "dan_Latn",
  deu_Latn: "deu_Latn",
  ell_Grek: "ell_Grek",
  eng_Latn: "eng_Latn",
  est_Latn: "est_Latn",
  fin_Latn: "fin_Latn",
  fra_Latn: "fra_Latn",
  fuv_Latn: "fuv_Latn",
  gle_Latn: "gle_Latn",
  glg_Latn: "glg_Latn",
  guj_Gujr: "guj_Gujr",
  hau_Latn: "hau_Latn",
  heb_Hebr: "heb_Hebr",
  hin_Deva: "hin_Deva",
  hrv_Latn: "hrv_Latn",
  hun_Latn: "hun_Latn",
  hye_Armn: "hye_Armn",
  ibo_Latn: "ibo_Latn",
  ind_Latn: "ind_Latn",
  isl_Latn: "isl_Latn",
  ita_Latn: "ita_Latn",
  jav_Latn: "jav_Latn",
  jpn_Jpan: "jpn_Jpan",
  kam_Latn: "kam_Latn",
  kan_Knda: "kan_Knda",
  kat_Geor: "kat_Geor",
  kaz_Cyrl: "kaz_Cyrl",
  khm_Khmr: "khm_Khmr",
  kir_Cyrl: "kir_Cyrl",
  kor_Hang: "kor_Hang",
  lao_Laoo: "lao_Laoo",
  lij_Latn: "lij_Latn",
  lim_Latn: "lim_Latn",
  lin_Latn: "lin_Latn",
  lit_Latn: "lit_Latn",
  ltz_Latn: "ltz_Latn",
  lug_Latn: "lug_Latn",
  luo_Latn: "luo_Latn",
  lvs_Latn: "lvs_Latn",
  mal_Mlym: "mal_Mlym",
  mar_Deva: "mar_Deva",
  mkd_Cyrl: "mkd_Cyrl",
  mlt_Latn: "mlt_Latn",
  khk_Cyrl: "khk_Cyrl",
  mri_Latn: "mri_Latn",
  mya_Mymr: "mya_Mymr",
  nld_Latn: "nld_Latn",
  nob_Latn: "nob_Latn",
  npi_Deva: "npi_Deva",
  nso_Latn: "nso_Latn",
  nya_Latn: "nya_Latn",
  oci_Latn: "oci_Latn",
  gaz_Latn: "gaz_Latn",
  ory_Orya: "ory_Orya",
  pan_Guru: "pan_Guru",
  pes_Arab: "pes_Arab",
  pol_Latn: "pol_Latn",
  por_Latn: "por_Latn",
  pbt_Arab: "pbt_Arab",
  ron_Latn: "ron_Latn",
  rus_Cyrl: "rus_Cyrl",
  slk_Latn: "slk_Latn",
  sna_Latn: "sna_Latn",
  snd_Arab: "snd_Arab",
  som_Latn: "som_Latn",
  spa_Latn: "spa_Latn",
  srp_Cyrl: "srp_Cyrl",
  swe_Latn: "swe_Latn",
  swh_Latn: "swh_Latn",
  tam_Taml: "tam_Taml",
  tel_Telu: "tel_Telu",
  tgk_Cyrl: "tgk_Cyrl",
  tgl_Latn: "tgl_Latn",
  tha_Thai: "tha_Thai",
  tur_Latn: "tur_Latn",
  ukr_Cyrl: "ukr_Cyrl",
  umb_Latn: "umb_Latn",
  urd_Arab: "urd_Arab",
  uzn_Latn: "uzn_Latn",
  vie_Latn: "vie_Latn",
  wol_Latn: "wol_Latn",
  xho_Latn: "xho_Latn",
  yor_Latn: "yor_Latn",
  zho_Hans: "zho_Hans",
  zho_Hant: "zho_Hant",
  zsm_Latn: "zsm_Latn",
  zul_Latn: "zul_Latn",
  af: "afr_Latn",
  ak: "aka_Latn",
  am: "amh_Ethi",
  ar: "arb_Arab",
  as: "asm_Beng",
  awa: "awa_Deva",
  ay: "ayr_Latn",
  az: "azb_Arab",
  ba: "bak_Cyrl",
  ban: "ban_Latn",
  be: "bel_Cyrl",
  bem: "bem_Latn",
  bg: "bul_Cyrl",
  bho: "bho_Deva",
  bm: "bam_Latn",
  bn: "mni_Beng",
  bo: "bod_Tibt",
  bs: "bos_Latn",
  bug: "bug_Latn",
  cs: "ces_Latn",
  cy: "cym_Latn",
  da: "dan_Latn",
  de: "deu_Latn",
  din: "dik_Latn",
  dyu: "dyu_Latn",
  dz: "dzo_Tibt",
  ee: "ewe_Latn",
  en: "eng_Latn",
  eo: "epo_Latn",
  et: "est_Latn",
  eu: "eus_Latn",
  fa: "pes_Arab",
  fi: "fin_Latn",
  fj: "fij_Latn",
  fo: "fao_Latn",
  fon: "fon_Latn",
  fr: "fra_Latn",
  fur: "fur_Latn",
  ga: "gle_Latn",
  gl: "glg_Latn",
  gn: "grn_Latn",
  gu: "guj_Gujr",
  ha: "hau_Latn",
  he: "heb_Hebr",
  hi: "hin_Deva",
  hr: "hrv_Latn",
  hu: "hun_Latn",
  hy: "hye_Armn",
  id: "ind_Latn",
  ig: "ibo_Latn",
  is: "isl_Latn",
  it: "ita_Latn",
  ja: "jpn_Jpan",
  jv: "jav_Latn",
  ka: "kat_Geor",
  kab: "kab_Latn",
  kk: "kaz_Cyrl",
  kmb: "kmb_Latn",
  kn: "kan_Knda",
  ko: "kor_Hang",
  kr: "knc_Arab",
  ks: "kas_Arab",
  ku: "kmr_Latn",
  lg: "lug_Latn",
  ln: "lin_Latn",
  lo: "lao_Laoo",
  lt: "lit_Latn",
  lv: "lvs_Latn",
  mag: "mag_Deva",
  mai: "mai_Deva",
  mi: "mri_Latn",
  min: "min_Arab",
  mk: "mkd_Cyrl",
  ml: "mal_Mlym",
  mn: "khk_Cyrl",
  mos: "mos_Latn",
  mr: "mar_Deva",
  ms: "zsm_Latn",
  mt: "mlt_Latn",
  my: "mya_Mymr",
  ne: "npi_Deva",
  no: "nno_Latn",
  om: "gaz_Latn",
  pag: "pag_Latn",
  pap: "pap_Latn",
  pl: "pol_Latn",
  pt: "por_Latn",
  qu: "quy_Latn",
  rn: "run_Latn",
  ru: "rus_Cyrl",
  rw: "kin_Latn",
  sa: "san_Deva",
  sat: "sat_Olck",
  sc: "srd_Latn",
  scn: "scn_Latn",
  sd: "snd_Arab",
  sg: "sag_Latn",
  shn: "shn_Mymr",
  sk: "slk_Latn",
  sl: "slv_Latn",
  sm: "smo_Latn",
  sn: "sna_Latn",
  so: "som_Latn",
  sq: "als_Latn",
  sr: "srp_Cyrl",
  ss: "ssw_Latn",
  su: "sun_Latn",
  sv: "swe_Latn",
  sw: "swh_Latn",
  ta: "tam_Taml",
  te: "tel_Telu",
  tg: "tgk_Cyrl",
  th: "tha_Thai",
  ti: "tir_Ethi",
  tk: "tuk_Latn",
  tl: "tgl_Latn",
  tn: "tsn_Latn",
  tpi: "tpi_Latn",
  tr: "tur_Latn",
  ts: "tso_Latn",
  tt: "tat_Cyrl",
  tum: "tum_Latn",
  tw: "twi_Latn",
  uk: "ukr_Cyrl",
  ur: "urd_Arab",
  uz: "uzn_Latn",
  vi: "vie_Latn",
  war: "war_Latn",
  wo: "wol_Latn",
  xh: "xho_Latn",
  yi: "ydd_Hebr",
  yo: "yor_Latn",
  zh: "zho_Hans",
  zho: "zho_Hant",
  zu: "zul_Latn"
};

// index.js
var MAIN_PATH = "main.py";
var py = new Py(".");
var MODELS = [
  "facebook/nllb-200-distilled-600M",
  "facebook/nllb-200-distilled-1.3B",
  "facebook/nllb-200-1.3B",
  "facebook/nllb-200-3.3B",
  "facebook/nllb-moe-54b"
];
function isValidLanguage(str) {
  return Object.keys(flores_default).indexOf(str) > -1;
}
function convertLanguage(str) {
  return flores_default[str];
}
function isValidModel(str) {
  return MODELS.indexOf(str) > -1;
}
async function init(force) {
  await py.init(force);
  await py.install("torch", [
    "--index-url",
    "https://download.pytorch.org/whl/cu118"
  ]);
  await py.install("transformers");
}
async function translate(text, from, to, model) {
  if (!model) {
    model = MODELS[0];
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MODELS,
  init,
  translate
});
