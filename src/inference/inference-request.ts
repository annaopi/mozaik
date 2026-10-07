import { Tool } from "@inference/tool"
import { StructuredOutputFormat } from "@inference/request-validation/structured-output"
import { Context } from "@inference/context"

export interface InferenceRequest {
	model: string
	maxOutputTokens?: number
	reasoningEffort?: string
	tools?: Tool[]
	streaming?: boolean
	structuredOutput?: StructuredOutputFormat
	context: Context
}
