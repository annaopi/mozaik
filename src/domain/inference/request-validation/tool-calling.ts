import type { RequestValidationRule } from "@domain/inference/request-validation/rule"
import type { ModelSpecification } from "@domain/inference/generative-model"
import { InferenceRequest } from "@domain/inference/inference-runner"

export class ToolUseRequestingValidation implements RequestValidationRule {
	readonly name = "tool-calling"

	isValid(inferenceRequest: InferenceRequest, model: ModelSpecification): boolean {
		if (inferenceRequest.tools === undefined) {
			return true
		}

		return model.supportsFunctionCalling
	}
}
