import * as nllb from "./dist/nllb-200.mjs";

(async function () {
  const text =
    "Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation";
  const source = "eng";
  const targets = ["zho", "kor", "jpn"];
  const model = nllb.MODELS[0];
  // 0: 'facebook/nllb-200-distilled-600M' <= default
  // 1: 'facebook/nllb-200-distilled-1.3B'
  // 2: 'facebook/nllb-200-1.3B'
  // 3: 'facebook/nllb-200-3.3B'
  // 4: 'facebook/nllb-moe-54b'

  // Create virtual environment
  // At first, initialize take a long time for download requirements.
  // The device must be installed Python3
  // https://www.python.org/downloads/
  await nllb.init();

  for (const target of targets) {
    try {
      // At first translate, initialize take a long time for download nllb model.
      // it requires at least 8 GB of available storage during initialization.
      const result = await nllb.translate(text, source, target, model);
      console.log(`${target}: ${result}`);
    } catch (err) {
      console.error(`${target} ERROR`);
      console.error(err);
    }
  }
})();
