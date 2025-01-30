export declare function getLang(str: string): string | undefined;
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
export declare function translate(text: string, from: string, to: string, model?: string): Promise<string>;
//# sourceMappingURL=index.d.ts.map