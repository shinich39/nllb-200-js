import sys
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# set stdout encoding
sys.stdout.reconfigure(encoding='utf-8')

def main(*args):
  model_name = args[0]
  text = args[1]
  src_lang = args[2]
  tgt_lang = args[3]

  device = "cuda:0" if torch.cuda.is_available() else "cpu"

  tokenizer = AutoTokenizer.from_pretrained(
    model_name, cache_dir="./.nllb-200-models", src_lang=src_lang
  )

  # https://github.com/huggingface/transformers/issues/2704
  model = AutoModelForSeq2SeqLM.from_pretrained(
    model_name, cache_dir="./.nllb-200-models",
  ).to(device)

  inputs = tokenizer(
    text=text, return_tensors="pt"
  ).to(device)
  
  # max_length <= 512
  # deprecated: tokenizer.lang_code_to_id
  translated_tokens = model.generate(
    **inputs, forced_bos_token_id=tokenizer.encode(tgt_lang)[1], max_length=384,
  )

  output = tokenizer.batch_decode(
    translated_tokens, skip_special_tokens=True,
  )[0]

  sys.stdout.write(output)
  sys.exit(0)

if __name__ == '__main__':
  main(*sys.argv[1:])