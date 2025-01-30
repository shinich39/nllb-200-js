// @ts-nocheck

import { describe, test, it } from 'node:test';
import assert from 'node:assert';
import { getLang, translate } from './index';

const eq = function (a, b, msg) {
  return typeof a === 'object'
    ? assert.deepStrictEqual(a, b, msg)
    : assert.strictEqual(a, b, msg);
};

describe('src/index.ts', () => {
  test('getLang', () => {
    eq(getLang('ak'), 'aka_Latn');
    eq(getLang('ja'), 'jpn_Jpan');
    eq(getLang('ko'), 'kor_Hang');
  });

  test('translate', async () => {
    const text =
      'Lockheed Martin Delivers Initial 5G Testbed To U.S. Marine Corps And Begins Mobile Network Experimentation';
    const source = 'eng';
    const targets = ['zho', 'kor', 'jpn'];

    for (const target of targets) {
      console.log('From', getLang(source));
      console.log('To', getLang(target));
      const result = await translate(text, source, target);
      console.log(result);
    }
  });
});
