---
title: Feedback in a loop — AI Agentic
excerpt: The personality behavior of AI
date: Oct 13, 2025
tags: [ai, agent]
---

On June 12, 2025, I was impressed by Philip Zeyliger's article "[The Unreasonable Effectiveness of an LLM Agent Loop with Tool Use][agent-loop-blog]".

[agent-loop-blog]: https://sketch.dev/blog/agent-loop

It just blew my mind to discover that an agent can be as simple as 9 lines of code:

> My co-workers and I have been working on an AI Programming Assistant called Sketch for the last few months. The thing I've been most surprised by is how shockingly simple the main loop of using an LLM with tool use is:
>
> ```py
> def loop(llm):
>    msg = user_input()
>    while True:
>        output, tool_calls = llm(msg)
>        print("Agent: ", output)
>        if tool_calls:
>            msg = [ handle_tool_call(tc) for tc in tool_calls ]
>        else:
>            msg = user_input()
> ```

This is quite reasonably could be to say: "*That's it? A for loop? Did you just discover fire?*" :pepe_surrender:

But it turns out, that wrapping our raw LLM in the code you wrote on your first day of class somehow unlocks its final form.

In the Anthropic's article [Building effective agents][effective-agents] mention about the Evaluator-optimizer workflow:
[effective-agents]: https://www.anthropic.com/engineering/building-effective-agents

> In the evaluator-optimizer workflow, one LLM call generates a response while another provides evaluation and feedback in a loop.

A feedback loop wraps a *proposer* with a *critic* so each attempt is evaluated, corrected, and re-run.

With that, its turns the simple agent loop into an iterative optimizer: a model can proposes, another to evaluates, and the next one proposal incorporates that feedback.

![](/assets/notes/feedback-in-a-loop-ai-agentic/agentic-feedback-loop.svg)
*Autonomous feedback in the loop agentic*

```py
def agent(llm, task, max_iters=5):
    """
    Self-reflective feedback loop agent
    """

    def score(output):
        score_output=llm(
            f"Score the following answer from 0–10 for quality and correctness:\n{output}\n"
            "Return only the number."
        )
        try:
            return float(score_text.strip())
        except ValueError:
            return 0.0

    draft = llm(f"Task:\n{task}\nReturn: your best first answer.")
    prev_score = score_output(draft)

    for _ in range(max_iters):
        # critique
        critique = llm(
            "You are the evaluator. Be concise and critical.\n"
            f"Task:\n{task}\nAnswer:\n{draft}\n"
            "Return: clear bullet points of issues and concrete fix steps."
        )

        # revision
        improved = llm(
            "You are the optimizer. Improve the answer using ONLY the critique.\n"
            f"Task:\n{task}\nPrevious:\n{draft}\nCritique:\n{critique}\n"
            "Return: revised answer only."
        )

        # evaluate
        new_score = score(improved)

        if new_score <= prev_score + 0.3:
            return improved

        draft, prev_score = improved, new_score

    return draft
```
