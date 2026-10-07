import type { InferenceEndpointMapper } from "@inference/inference-endpoint-mapper"
import { InferenceRequest } from "@inference/inference-request"
import { InferenceResult } from "@inference/inference-result"
import { SpaceEvent } from "@space/domain/event"

export interface InferenceEndpoint {
	endpointMapper: InferenceEndpointMapper
	infer(requestParams: InferenceRequest): Promise<InferenceResult>
	stream(requestParams: InferenceRequest): AsyncIterable<SpaceEvent>
}
