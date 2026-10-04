import type { InferenceRequest } from "@domain/inference/inference-runner"
import type { ModelSpecification } from "@domain/inference/generative-model"

export interface RequestValidationRule {
	readonly name: string
	isValid(inferenceRequest: InferenceRequest, model: ModelSpecification): boolean
}
