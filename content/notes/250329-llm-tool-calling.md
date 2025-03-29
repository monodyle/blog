---
title: LLM — Tool calling
excerpt: Tool calling allows a chat model to respond to a given prompt by "calling a tool". That enables LLMs to interact with enternal functions, like search web, fetch data, or executing taks. That enhance their utility beyond the text genenration.
date: Mar 29, 2025
tags: [ai, llm]
---

Tool calling allows a chat model to respond to a given prompt by "calling a tool". That enables LLMs to interact with enternal functions, like search web, fetch data, or executing taks. That enhance their utility beyond the text genenration.

## How it works?

Some models like Llama 3.1 or Qwen2.5 trained to recognize and use tools directly.

![Natively tool-calling in LLM](/assets/notes/llm-tool-calling/native-tool-call.svg)
*Natively tool-calling in LLM*

Some others model is lacking of native tool calling support, like older GPT-2 or older Llama variants, weren't trained for tool calling at all. Tool now relies on system prompts and framework like [Ollama](https://ollama.com/) to simulate it.

![Example how simulate tool calling works in LLM](/assets/notes/llm-tool-calling/non-native-tool-call.svg)
*Example how simulate tool calling works in LLM*

System prompts using in Ollama/LMStudio example:

```md
{{- if .Suffix }}<|fim_prefix|>{{ .Prompt }}<|fim_suffix|>{{ .Suffix }}<|fim_middle|>
{{- else if .Messages }}
{{- if or .System .Tools }}<|im_start|>system
{{- if .System }}
{{ .System }}
{{- end }}
{{- if .Tools }}

# Tools

You may call one or more functions to assist with the user query.

You are provided with function signatures within <tools></tools> XML tags:
<tools>
{{- range .Tools }}
{"type": "function", "function": {{ .Function }}}
{{- end }}
</tools>

For each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:
<tool_call>
{"name": <function-name>, "arguments": <args-json-object>}
</tool_call>
{{- end }}<|im_end|>
{{ end }}
{{- range $i, $_ := .Messages }}
{{- $last := eq (len (slice $.Messages $i)) 1 -}}
{{- if eq .Role "user" }}<|im_start|>user
{{ .Content }}<|im_end|>
{{ else if eq .Role "assistant" }}<|im_start|>assistant
{{ if .Content }}{{ .Content }}
{{- else if .ToolCalls }}<tool_call>
{{ range .ToolCalls }}{"name": "{{ .Function.Name }}", "arguments": {{ .Function.Arguments }}}
{{ end }}</tool_call>
{{- end }}{{ if not $last }}<|im_end|>
{{ end }}
{{- else if eq .Role "tool" }}<|im_start|>user
<tool_response>
{{ .Content }}
</tool_response><|im_end|>
{{ end }}
{{- if and (ne .Role "assistant") $last }}<|im_start|>assistant
{{ end }}
{{- end }}
{{- else }}
{{- if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}{{ if .Prompt }}<|im_start|>user
{{ .Prompt }}<|im_end|>
{{ end }}<|im_start|>assistant
{{ end }}{{ .Response }}{{ if .Response }}<|im_end|>{{ end }}
```

## References

- [How to use chat models to call tools - LangChain](https://python.langchain.com/docs/how_to/tool_calling/)
- [Ollama Template document](https://github.com/ollama/ollama/blob/main/docs/template.md)

Thanks @github.com/huytd for sharing this
