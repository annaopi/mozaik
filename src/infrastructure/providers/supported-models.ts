import { AnthropicMessages } from "@infrastructure/providers/anthropic/anthropic-messages"
import { OpenAIResponses } from "@infrastructure/providers/openai/openai-responses"
import { GeminiGenerateContent } from "@infrastructure/providers/gemini/gemini-generate-content"
import { OpenAIChatCompletions } from "@infrastructure/providers/openai/openai-chat-completions"
import { claudeSonnet46Specification } from "@infrastructure/providers/anthropic/models/claude-4-6-sonnet"
import { claudeOpus48Specification } from "@infrastructure/providers/anthropic/models/claude-4-8-opus"
import { claudeOpus47Specification } from "@infrastructure/providers/anthropic/models/claude-4-7-opus"
import { gemini35FlashSpecification } from "@infrastructure/providers/gemini/models/gemini-3-5-flash"
import { gemini31ProSpecification } from "@infrastructure/providers/gemini/models/gemini-3-1-pro"
import { deepSeekV4FlashSpecification } from "@infrastructure/providers/deepseek/models/deepseek-v4-flash"
import { deepSeekV4ProSpecification } from "@infrastructure/providers/deepseek/models/deepseek-v4-pro"
import { gpt54Specification } from "@infrastructure/providers/openai/models/gpt-5-4"
import { gpt54MiniSpecification } from "@infrastructure/providers/openai/models/gpt-5-4-mini"
import { gpt54NanoSpecification } from "@infrastructure/providers/openai/models/gpt-5-4-nano"
import { gpt55Specification } from "@infrastructure/providers/openai/models/gpt-5-5"
import { claudeHaiku45Specification } from "@infrastructure/providers/anthropic/models/claude-4-5-haiku"

import { gpt6LunaSpecification } from "@infrastructure/providers/openai/models/gpt-6-luna"
import { gpt6SolSpecification } from "@infrastructure/providers/openai/models/gpt-6-sol"
import { gpt61SolSpecification } from "@infrastructure/providers/openai/models/gpt-6-1-sol"
import { gpt6AstraSpecification } from "@infrastructure/providers/openai/models/gpt-6-astra"
import { claudeSonnet5Specification } from "@infrastructure/providers/anthropic/models/claude-5-sonnet"
import { claudeSonnet55Specification } from "@infrastructure/providers/anthropic/models/claude-5-5-sonnet"
import { claudeOpus55Specification } from "@infrastructure/providers/anthropic/models/claude-5-5-opus"
import { claudeFable51Specification } from "@infrastructure/providers/anthropic/models/claude-5-1-fable"
import { gemini35FlashLiteSpecification } from "@infrastructure/providers/gemini/models/gemini-3-5-flash-lite"
import { gemini38FlashSpecification } from "@infrastructure/providers/gemini/models/gemini-3-8-flash"
import { deepSeekFlashSpecification } from "@infrastructure/providers/deepseek/models/deepseek-flash"
import type { GenerativeModel } from "@domain/inference/generative-model"

export const supportedModels: GenerativeModel[] = [
	{
		endpoint: new OpenAIResponses(),
		specification: gpt54Specification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt54MiniSpecification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt54NanoSpecification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt55Specification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt6LunaSpecification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt6SolSpecification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt61SolSpecification,
	},
	{
		endpoint: new OpenAIResponses(),
		specification: gpt6AstraSpecification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeHaiku45Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeSonnet46Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeOpus47Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeOpus48Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeSonnet5Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeSonnet55Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeOpus55Specification,
	},
	{
		endpoint: new AnthropicMessages(),
		specification: claudeFable51Specification,
	},
	{
		endpoint: new GeminiGenerateContent(),
		specification: gemini35FlashSpecification,
	},
	{
		endpoint: new GeminiGenerateContent(),
		specification: gemini31ProSpecification,
	},
	{
		endpoint: new GeminiGenerateContent(),
		specification: gemini35FlashLiteSpecification,
	},
	{
		endpoint: new GeminiGenerateContent(),
		specification: gemini38FlashSpecification,
	},
	{
		endpoint: new OpenAIChatCompletions(),
		specification: deepSeekV4FlashSpecification,
	},
	{
		endpoint: new OpenAIChatCompletions(),
		specification: deepSeekV4ProSpecification,
	},
	{
		endpoint: new OpenAIChatCompletions(),
		specification: deepSeekFlashSpecification,
	},
]
