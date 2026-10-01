import type { ModelSpecification } from "@domain/inference/generative-model"
import type { RequestValidationRule } from "@domain/inference/request-validation/rule"
import type { InferenceRequest } from "@domain/inference/inference-runner"

export class StreamingValidation implements RequestValidationRule {
	readonly name = "streaming"

	isValid(inferenceRequest: InferenceRequest, model: ModelSpecification): boolean {
		if (!inferenceRequest.streaming) {
			return true
		}

		return model.supportsStreaming
	}
}
