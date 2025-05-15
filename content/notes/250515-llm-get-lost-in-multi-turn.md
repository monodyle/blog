---
title: LLMs get lost in multi-turn
excerpt: TLDR the "LLMs Get Lost In Multi-Turn Conversation" research
date: May 15, 2025
tags: [ai, llm]
---

This is a self-summary of key takeaways from [LLMs Get Lost In Multi-Turn Conversation][paper] paper. Please contact me if you find any inaccuracies.

## Takeaways

1. Total 15 LLMs was tested, from smaller models like Llama3.1-8B-Instruct to top market leaders like GPT-4.1 or Gemini 2.5 Pro. All showed a significant performance drop (average 39%) in multi-turn conversations compared to single-turn. This indicates that even the most advanced LLMs struggle with extended conversations
> At a high level, **every model sees its performance degrade on**
> **every task when comparing FULL and SHARDED performance, with an average degradation of -39%**. We name
> this phenomenon Lost in Conversation: models that achieve stellar (90%+) performance in the lab-like setting of
> fully-specified, single-turn conversation struggle on the exact same tasks in a more realistic setting when the conversation
> is underspecified and multi-turn.
> 
> _From section **6.1. Average Performance Findings**_
2. More interestingly, though better models tend to have slightly higher multi-turn aptitude, all models tend to have similar levels of unreliability. In real-world tests with the same instruction and no specific configuration, results varied widely, with the worst runs showing an average performance drop of 50% compared to the best runs. This refines our definition of the *lost in conversations* phenomenon:  when comparing single- and multi-turn settings, they found that the large performance degradations are due in large part to increased model unreliability, rather than a loss in aptitude
3. 2-turn is already enough to poisoned context
4. Most LLMs tend to make risky early assumptions at the beginning, which is a key reason why multi-turn performs poorly. They stubbornly stick to these assumptions, making it extremely difficult to steer them back to accurate results through further conversation
5. Models that provide longer responses (like reasoning models, such as DeepSeek-R1) tend to make more assumptions, which can lead to more confusion and derail the conversation, since their reasoning is included in the context. On average, reasoning models produce responses 33% longer than other models. The paper mentions that adding test-time (reasoning tokens) doesn't improve the effectiveness of multi-turn
6. Recapping or snowballing previous details for the LLM can reduce the model's stubbornness

## References

Original paper: [LLMs Get Lost In Multi-Turn Conversation][paper]

Authors: Philippe Laban, Hiroaki Hayashi, Yingbo Zhou, Jennifer Neville

[paper]: https://arxiv.org/abs/2505.06120
