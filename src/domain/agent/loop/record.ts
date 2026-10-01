import { CompletedOperation, PendingOperation } from "@domain/agent/loop/operation"
import { LoopTransition } from "@domain/agent/loop/transition"
import { InferenceRequest } from "@domain/inference/inference-runner"
import { LoopStateId } from "@domain/agent/loop/loop"
import { LoopRule } from "@domain/agent/loop/rule"

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
