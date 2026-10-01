import type { InferenceRequest } from "@domain/inference/inference-runner"
import type { ModelSpecification } from "@domain/inference/generative-model"
import type { RequestValidationRule } from "@domain/inference/request-validation/rule"
import { ReasoningEffortValidation } from "@domain/inference/request-validation/reasoning-effort"
import { ToolUseRequestingValidation } from "@domain/inference/request-validation/tool-calling"
import { StreamingValidation } from "@domain/inference/request-validation/streaming"
import { StructuredOutputValidation } from "@domain/inference/request-validation/structured-output"
import { ContextValidation } from "@domain/inference/request-validation/context"

export const defaultRequestValidationRules: RequestValidationRule[] = [
	new ReasoningEffortValidation(),
	new ToolUseRequestingValidation(),
	new StreamingValidation(),
	new StructuredOutputValidation(),
	new ContextValidation(),
]

export class InferenceRequestValidator {
	constructor(private readonly rules: RequestValidationRule[] = defaultRequestValidationRules) {}

	validate(inferenceRequest: InferenceRequest, model: ModelSpecification): void {
		for (const rule of this.rules) {
			if (!rule.isValid(inferenceRequest, model)) {
				throw new Error(`Request validation "${rule.name}" failed for model "${model.name}"`)
			}
		}
	}
}
