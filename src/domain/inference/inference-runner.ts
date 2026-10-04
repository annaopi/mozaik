import { SpaceEvent } from "@domain/space/event"
import { Context } from "@domain/inference/context"
import { StructuredOutputFormat } from "@domain/inference/request-validation/structured-output"
import { TokenUsage } from "@domain/inference/token-usage"
import { Tool } from "@domain/inference/tool"
import { ModelOutputItem } from "@domain/inference/context"

export type InferenceRequest = {
	model: string
	maxOutputTokens?: number
	reasoningEffort?: string
	tools?: Tool[]
	streaming?: boolean
	structuredOutput?: StructuredOutputFormat
	context: Context
}

export type InferenceResult = {
	items: ModelOutputItem[]
	tokenUsage: TokenUsage | undefined
	rowResponse: any
}

export interface InferenceRunner {
	run(request: InferenceRequest): Promise<InferenceResult>
	stream(request: InferenceRequest): AsyncGenerator<SpaceEvent>
}
