import { SpaceEvent } from "@space/domain/event"
import { InferenceRequest } from "@inference/inference-request"
import { InferenceResult } from "@inference/inference-result"

export interface InferenceRunner {
	run(request: InferenceRequest): Promise<InferenceResult>
	stream(request: InferenceRequest): AsyncGenerator<SpaceEvent>
}
