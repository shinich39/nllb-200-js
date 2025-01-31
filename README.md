# nllb-200-js

nllb-200 javascript wrapper

## Getting Started

### Requirements

- [nodejs](https://nodejs.org/en/download/package-manager/current)
- [python3](https://www.python.org/downloads/)

### Installation

```console
npm install github:shinich39/node-nllb-200
```

### Usage

```js
import { translate } from "node-nllb-200";

const text =
"Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation";
const source = "eng";
const targets = ["zho", "kor", "jpn"];

for (const target of targets) {
  // At first translate, initialize take a long time for downloading nllb-200 model.
  const result = await translate(source, target, text);
  console.log(result);
  // zho: 6.081s
  // 洛克希德馬丁向美國海兵隊提供了初步5G測試床,
  // kor: 5.634s
  // 로크히드 마틴은 미국 해병대에 첫 번째 5G 테스트 베드를 공급하고 모바일 네트워크 실험을 시작했습니다
  // jpn: 5.700s
  // ロックヒッド・マーティンが5Gテストベッドをアメリカ海兵隊に提供し,モバイルネットワーク実験を開始
}
```

## Acknowledgements

- [no-language-left-behind](https://ai.meta.com/research/no-language-left-behind/)
- [nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M)