import { CompletedOperation, PendingOperation } from "@agent/loop/operation"
import { LoopTransition } from "@agent/loop/transition"
import { InferenceRequest } from "@inference/inference-runner"
import { LoopStateId } from "@agent/loop"
import { LoopRule } from "@agent/loop/rule"

export interface LoopRecord {
	id: string
	agentId: string
	subject: string
	createdAt: Date
	state: LoopStateId
	inferenceRequest?: InferenceRequest
	pendingOperation?: PendingOperation
	transitionHistory: LoopTransition[]
	operationHistory: CompletedOperation[]
	rules: LoopRule[]
	executionStrategy: "manual" | "auto"
}
