---
title: Into the LLM Tokenization
excerpt: How we actually talk with LLM?
illustration: /assets/notes/into-the-llm-tokenization/illustration.png
color: '#f1e4d1'
date: Mar 01, 2025
tags: [ai, llm]
---

## How do they create tokens?

- Starts with crawling data from the internet to build a massive dataset
- Filter data with classifier to removing part of the data that low performance (noisy, duplicate content, low-quality text, and irrelevant information)
- Cleaned data will be compressed into something the machine usable

So instead of feeding a raw text into model, it converted into tokens

## Tokenization

<iframe
  src="https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu/embed/viewer/default/train"
  frameborder="0"
  width="100%"
  height="480px"
></iframe>

*Example: FineWeb-Edu dataset[^1]*

[^1]: https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu

1. With the cleaned dataset, the tokenizer firstly will breaking down the raw text into smaller *pieces* (also *tokens*). These can be words, parts of words, or punctuation,... depending on the tokenizer
2. The tokens will be assigned a unique ID, commonly a number. For example, the word **cat** might be one token, the word **running** could split into **run** and **ning**
3. Tokenization reduces raw text to numbers that a language model can process, so when a model usually introduced with *15 trillion tokens* that means 15 trillion of *these units* were created after cleaning and filtering.

### The chat

![How the UI display](/assets/notes/into-the-llm-tokenization/users.png)
*How the UI display*

![Chat under the hood](/assets/notes/into-the-llm-tokenization/tokenizer.png)
*Chat under the hood, using [tiktokenizer.vercel.app](https://tiktokenizer.vercel.app/)*

*Note*: Did you notice asterisks (`*`) is recognized as 2 tokens? The first one have a space before.

![LLM see](/assets/notes/into-the-llm-tokenization/llms.png)
*What LLMs see*

### The mess

Some tokenizer will applied **Byte Pair Encoding** (**BPE**, or **digram coding**)[^2] to help model more generalized across the messy dataset.

[^2]: https://en.wikipedia.org/wiki/Byte_pair_encoding

Starts with individual tokens, it will repeatedly find most frequent pair of token in the raw data, and merges them into a single new token.

For example: "you" and "are" in dataset obviously appear together a lot, the BPE algorithm might create "you are" as one token instead of two.

This method can reduces the number of tokens, speeding up training and inference.

## References

- [Deep Dive into LLMs like ChatGPT](https://youtu.be/7xTGNNLPyMI?si=Hc72uQelJ6Ckj8SA) by [Andrej Karpathy](https://x.com/karpathy)
- [🍷 FineWeb: decanting the web for the finest text data at scale](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
