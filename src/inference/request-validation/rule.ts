import type { InferenceRequest } from "@inference/inference-request"
import type { ModelSpecification } from "@inference/generative-model"

export interface RequestValidationRule {
	readonly name: string
	isValid(inferenceRequest: InferenceRequest, model: ModelSpecification): boolean
}
