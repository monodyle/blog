---
title: LLM — Tool calling
excerpt: Tool calling allows a chat model to respond to a given prompt by "calling a tool". That enables LLMs to interact with enternal functions, like search web, fetch data, or executing taks. That enhance their utility beyond the text genenration.
date: Mar 29, 2025
tags: [ai, llm]
---

Tool calling allows a chat model to respond to a given prompt by "calling a tool". That enables LLMs to interact with enternal functions, like search web, fetch data, or executing taks. That enhance their utility beyond the text genenration.

## How it works?

LLMs can't directly execute functions. However, there are two approaches that help LLMs to identify when and how to call a tool:
1. LLMs with specifically trained or fine-tuned to recognize when the tool should be used. This involves teaching the machine to detect patterns in input that signal a need for tool interference
2. Tools are provided to the LLMs via system prompts, usually is a list of structure functions with description. LLM can generate a structured format, indicating which tool will be call with what parameters. A framework, such as [Ollama](https://ollama.com), must know how to parse structured response and handle the execution

![Example how simulate tool calling works in LLM](/assets/notes/llm-tool-calling/non-native-tool-call.svg)
*Example how simulate tool calling works in LLM*

System prompts using in Ollama/LMStudio example:

```md file="System Prompts"
For each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:
<tool_call>
{"name": <function-name>, "arguments": <args-json-object>}
</tool_call>
{{- end }}<|im_end|>
{{ end }}
 
...
 
<|im_start|>assistant
{{ if .Content }}{{ .Content }}
{{- else if .ToolCalls }}<tool_call>
{{ range .ToolCalls }}{"name": "{{ .Function.Name }}", "arguments": {{ .Function.Arguments }}}
{{ end }}</tool_call>
{{- end }}{{ if not $last }}<|im_end|>
{{ end }}
```

## References

- [How to use chat models to call tools - LangChain](https://python.langchain.com/docs/how_to/tool_calling/)
- [Ollama Template document](https://github.com/ollama/ollama/blob/main/docs/template.md)
- [LLM sử dụng tool như thế nào?](https://notes.huy.rocks/posts/how-llm-use-tools.html)

Thanks @github.com/huytd for sharing this

## Edit

- Mar 31, 2025: Clarify that LLM can't directly calling tools or external functions, thanks @github.com/ledongthuc and @github.com/huytd for pointing this out
