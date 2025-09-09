---
title: LLM — Sycophancy
excerpt: The personality behavior of AI
date: Sep 09, 2025
tags: [ai, llm]
---

This topic isn't new, I want to dig into this personality behavior of AI

> A related concern involves sycophancy, which erodes trust. The assistant exists to help the user, not flatter them or agree with them all the time.
>
> *From [**Model Spec: Don't be sycophantic**](https://model-spec.openai.com/2025-04-11.html#avoid_sycophancy) by OpenAI*

I wasn't surprised when I reading this. The first time @github.com/thien-do sent me Jakob Nielsen's article '[*AI: First New UI Paradigm in 60 Years*](https://www.nngroup.com/articles/ai-paradigm/)', it literally mentioned:

> With the new AI systems, **the user no longer tells the computer what to do**. Rather, **the user tells the computer what outcome they want**. Thus, the third UI paradigm, represented by current generative AI, is **intent-based outcome specification**.
>
> *From [**AI: First New UI Paradigm in 60 Years**](https://www.nngroup.com/articles/ai-paradigm/) by Jakob Nielsen*

A common characteristic among many AI models is a tendency toward sycophantic behavior. For example, earlier version of Anthropic Claude's models, their frequent use of agreeable phrases like "*You're absolutely right*"[^1][^2][^3] often regardless of the user's input validity. This eagerness to please, even in response to absurd statements, is not an only issue with Claude, it remains a prevalent trait in many others AI models today.

[^1]: https://www.reddit.com/r/ClaudeAI/comments/152b51r/you_are_absolutely_right/
[^2]: https://github.com/anthropics/claude-code/issues/3382
[^3]: https://news.ycombinator.com/item?id=44885398

When reading AI-generated content, focus on the input prompt rather than blindly trusting the output. When someone use AI-generated content to convince you of something, be skepticism.

Fortunately, many AI companies and researchers are now prioritizing responsible model training practices. Instead of relying on system instructions to constrain AI behavior.

> In May 2025 we explained the immediate measures we took to address sycophantic behaviors that emerged in our GPT-4o model: **we rolled back a newly deployed version of the GPT-4o model, and also adjusted the system prompt for the model that remained in production. System prompts, while easy to modify, have a more limited impact on model outputs relative to changes in post-training. For GPT-5, we post-trained our models to reduce sycophancy.** Using conversations representative of production data, we evaluated model responses, then assigned a score reflecting the level of sycophancy, which was used as a reward signal in training.
>
> *From section **3.3 Sycophancy** in [**GPT-5 System Card**](https://cdn.openai.com/gpt-5-system-card.pdf) by OpenAI*

As AI continues to evolve endlessly, the paradigm is still centered on generating outputs based on what user ask it to do. But if AI were to have a personality, what would it be like, and how much sycophancy should it exhibit?

[^1]: https://www.reddit.com/r/ClaudeAI/comments/152b51r/you_are_absolutely_right/
[^2]: https://github.com/anthropics/claude-code/issues/3382
[^3]: https://news.ycombinator.com/item?id=44885398
