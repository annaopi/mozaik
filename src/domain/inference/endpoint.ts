import type { InferenceEndpointMapper } from "@domain/inference/inference-endpoint-mapper"
import { InferenceRequest, InferenceResult } from "@domain/inference/inference-runner"
import { SpaceEvent } from "@domain/space/event"

export interface Endpoint {
	endpointMapper: InferenceEndpointMapper
	infer(requestParams: InferenceRequest): Promise<InferenceResult>
	stream(requestParams: InferenceRequest): AsyncIterable<SpaceEvent>
}
