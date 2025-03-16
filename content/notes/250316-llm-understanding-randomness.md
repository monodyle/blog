---
title: LLM Hyperparameters — Understanding the Randomness
excerpt: Is all of this just a concidence?
date: Mar 16, 2025
tags: [ai, llm]
---

### The Generation

The LLMs generation usually learned the patterns how together or apart of the words. So basically, the LLMs text generation is just the *probabilities* for the next token based on previous context. But what *probabilities*?

![Generation Work](/assets/notes/llm-understanding-randomness/how-generation-work.svg)
*The generation work by predict one token at a time*

When LLMs generating, there are usually a few candidates in the vocabulary for each token, and each token has a certain likeihood of being choosen.

![Generation Work](/assets/notes/llm-understanding-randomness/token-probabilities.svg)
*Neutral network internals*

### The Softmax

Mathematically, LLMs using [softmax function](https://en.wikipedia.org/wiki/Softmax_function) to transforming logits into a probability distribution over a tokens vocabulary.

$$
\sigma(z_i) = \frac{e^{z_i \over T}}{\sum_{j=1}^{n} e^{z_j \over T}}
$$

Where:
- $z=[z_1,z_2,...,z_n]$ is given vector of logits
- $n$ is vocabulary size
- $e$ is Euler number
- $T$ is temperature parameter

The softmax function ensure that each $\sigma(z_i)$ value is between $(0,1)$.

### The Temperature

Temperature controls the unpredictability of a LLMs' output.

With a higher temperature, model's ouput get more creative and less predictable, as it amplifies the chances of selecting less protable tokens while reducing the chances for the more likely ones.

On the other hand, a lower temperature yield more cautious and predictable outputs. The softmax function magnifies differences between logits, leading to sharper probability distributions.

![](/assets/notes/llm-understanding-randomness/temperature-affect-to-probability-distributions.svg)
*How temperature affect to probability distributions*

### The Top-P

[Top-P](https://en.wikipedia.org/wiki/Top-p_sampling) helps control the randomness of LLMs' output. It sets a probability cutoff and picks tokens whose total likelihood adds up to or exceeds this threshold.

![](/assets/notes/llm-understanding-randomness/top-p-sampling.svg)
*How Top-P establishing the tokens*

Let's look at an example where an LLM predicts next word in the sentence "**The quick brown...**"

The LLM might rank the top token choices like:
- **fox** with a 0.5 probability
- **dog** with a 0.25 probability
- **bear** with a 0.15 probability
- **fish** with a 0.07 probability
- and other tokens with probability below 0.05

If Top-P is set to `0.9`, the LLM will only consider tokens whose combined probabilities add up to at least **90%**:

- Starting with **fox**: 50% so far
- Adding **dog**: now 75%
- Adding **bear**: total now reaches 90%

At this point, the LLM stops adding more tokens. It then randomly pick one among **fox**, **dog**, or **bear** for the next word.

### References

- [LLM Temperature](https://www.hopsworks.ai/dictionary/llm-temperature)
- [Deep Dive into LLMs like ChatGPT](https://youtu.be/7xTGNNLPyMI?si=Hc72uQelJ6Ckj8SA) by [Andrej Karpathy](https://x.com/karpathy)
