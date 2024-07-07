# nllb-200-js

nllb-200 wrapper with javascript.

Currently supported on windows only.

## Requirements

[nodejs](https://nodejs.org/en/download/package-manager/current)
[python3](https://www.python.org/downloads/)

## Usage

```js
import * as nllb from "nllb-200-js";

(async function () {
  const text =
    "Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation";
  const source = "eng_Latn";
  const targets = ["zho_Hans", "kor_Hang", "jpn_Jpan"];
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
    // At first translate, initialize take a long time for download nllb model.
    // it requires at least 8 GB of available storage during initialization.
    const result = await nllb.translate(text, source, target, model);
    console.log(`${target}: ${result}`);
  }
  // zho_Hans: 洛克希德马丁向美国海军陆战队提供了初步5G测试台,开始移动网络实验
  // kor_Hang: 로크히드 마틴은 미국 해병대에 첫 번째 5G 테스트 베드를 공급하고 모바일 네트워크 실험을 시작했습니다
  // jpn_Jpan: ロックヒッド・マーティンが5Gテストベッドをアメリカ海兵隊に提供し,モバイルネットワーク実験を開始
})();
```

## References

- [no-language-left-behind](https://ai.meta.com/research/no-language-left-behind/)
- [nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M)
- [Open-NLLB](https://github.com/gordicaleksa/Open-NLLB)
- [nllb-en-ko-translation](https://int-i.github.io/python/2023-09-05/nllb-en-ko-translation/)
- [Language-Code-ISO-639-FLORES-200](https://jay-chamber.tistory.com/entry/Language-Code-ISO-639-FLORES-200)
