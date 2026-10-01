import { LoopStateId } from "@domain/agent/loop"
import {
	AwaitingInference,
	AwaitingInferenceRequest,
	AwaitingToolOutput,
	Completed,
	Idle,
	LoopSpecification,
	Stopped,
} from "@domain/agent/loop/specification"

export class LoopStateUseCase {
	execute(loopStateId: LoopStateId): LoopSpecification {
		if (loopStateId === "idle") {
			return new Idle()
		}
		if (loopStateId === "awaiting_inference_request") {
			return new AwaitingInferenceRequest()
		}
		if (loopStateId === "awaiting_inference") {
			return new AwaitingInference()
		}
		if (loopStateId === "awaiting_tool_output") {
			return new AwaitingToolOutput()
		}
		if (loopStateId === "stopped") {
			return new Stopped()
		}
		if (loopStateId === "completed") {
			return new Completed()
		}
		throw new Error(`Invalid loop state: ${loopStateId}`)
	}
}
