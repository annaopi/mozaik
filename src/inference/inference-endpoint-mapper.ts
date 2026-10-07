import type { InferenceRequest } from "@inference/inference-request"
import type { InferenceResult } from "@inference/inference-result"

export interface InferenceEndpointMapper {
	toRequest(inferenceRequest: InferenceRequest): any
	toResponse(response: any): InferenceResult
}
