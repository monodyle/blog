---
title: LLaDA—Diffusion LLM at first glance
excerpt: Text-generated sampling via diffusion
date: Mar 10, 2025
tags: [ai, llm]
---

On Feb 27, [@InceptionAILabs](https://x.com/InceptionAILabs) introduce [Mecury](https://twitter.com/InceptionAILabs/status/1894847919624462794) to the world, and said it's diffusion large language models.

<figure>
<video controls width="100%">
  <source src="https://framerusercontent.com/assets/YURlGaqdh4MqvUPfSmGIcaoIFc.mp4" type="video/mp4" />
</video>
<figcaption>

"We are excited to introduce Mercury, the first commercial-grade diffusion large language model (dLLM)! dLLMs push the frontier of intelligence and speed with parallel, coarse-to-fine text generation." - [@InceptionAILabs](https://x.com/InceptionAILabs/status/1894847919624462794)

</figcaption>
</figure>


## What is Diffusion?

Similar with generate image in **Stable Diffusion**, the model use a parallel method of transforming noise into unmasked, by progressively refining random noise into coherent sequence.

## What's the difference?

- LLaDA (**L**arge **La**nguage **D**iffusion with m**A**sking) generation starting with noise, refines over steps to denoising the entire sequence. While ARMs (Autoregressive Models) generates sequence token-by-token, from left to right
- Training LLaDA using vanilla transformer instead of causal transformer (like GPT)
- **Vanilla transformer** has 2 steps, encoder and decoder:
  - **Encoder**, or **Forward Data Masking** process: Where the original sequence (clean data) is progressively corrupted by masking tokens over a series of steps
  - **Decoder**, or **Reverse Denoising** process: Model starts to iteratively predicts the original sequence, from noisy content to unmasked tokens
  - This whole training processes objective is to minimize the difference between the predicted denoised sequence and the original sequence
- LLaDA has stronger reversal resoning, the score of forward reasoning and reversal reasoning are approximately equal[^1]. But talking in numbers, the reversal score is not much better, the forward score is quite a bit lower than ARMs. Hope to it can improve in future
- LLaDA seems difficult to fine-tuned/reinforcement learning because of sensitivity to hyperparameters

[^1]: See "Table 3. Comparison in the Poem Completion Task." - https://arxiv.org/pdf/2502.09992

## References

- [Andrej Karpathy tweet](https://x.com/karpathy/status/1894923254864978091)
- [Large Language Diffusion Models project page](https://ml-gsai.github.io/LLaDA-demo/)
- [Large Language Diffusion Models paper (arXiv)](https://arxiv.org/abs/2502.09992)
- [Large Language Diffusion Models paper (Hugging Face)](https://huggingface.co/papers/2502.09992)
