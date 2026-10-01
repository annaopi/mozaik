import { ToolUseRequest, ToolUseResult } from "@domain/inference/context"
import { InferenceRequest, InferenceResult } from "@domain/inference/inference-runner"
import {
	PendingOperation,
	PendingInference,
	PendingToolExecution,
	CompletedOperation,
} from "@domain/agent/loop/operation"
import { LoopTransition } from "@domain/agent/loop/transition"
import { LoopRecord } from "@domain/agent/loop/record"
import { LoopRule } from "./rule"
import { SystemClock } from "@util/system-clock"
import { UuidGenerator } from "@util/uuid-generator"

export type LoopStateId =
	| "idle"
	| "awaiting_inference_request"
	| "awaiting_inference"
	| "awaiting_tool_output"
	| "stopped"
	| "completed"

export class Loop {
	private readonly loopId: string
	private readonly agentId: string
	private readonly subject: string
	private readonly createdAt: Date
	private state: LoopStateId
	private pendingOperation: PendingOperation | undefined
	private readonly transitionHistory: LoopTransition[]
	private inferenceRequest: InferenceRequest | undefined
	private readonly operationHistory: CompletedOperation[]
	private readonly loopRules: LoopRule[]

	private constructor(
		loopId: string,
		agentId: string,
		subject: string,
		createdAt: Date,
		state: LoopStateId,
		inferenceRequest: InferenceRequest | undefined,
		pendingOperation: PendingOperation | undefined,
		transitionHistory: LoopTransition[],
		operationHistory: CompletedOperation[],
		rules: LoopRule[],
	) {
		this.loopId = loopId
		this.agentId = agentId
		this.subject = subject
		this.createdAt = createdAt
		this.state = state
		this.inferenceRequest = inferenceRequest
		this.pendingOperation = pendingOperation
		this.transitionHistory = transitionHistory
		this.operationHistory = operationHistory
		this.loopRules = rules
	}

	get id(): string {
		return this.loopId
	}

	get stateId(): LoopStateId {
		return this.state
	}

	get pending(): PendingOperation | undefined {
		return this.pendingOperation
	}

	get history(): readonly LoopTransition[] {
		return this.transitionHistory
	}

	get completedOperations(): readonly CompletedOperation[] {
		return this.operationHistory
	}

	get request(): InferenceRequest | undefined {
		return this.inferenceRequest
	}

	get rules(): readonly LoopRule[] {
		return this.loopRules
	}

	getAgentId(): string {
		return this.agentId
	}

	record(): LoopRecord {
		return {
			id: this.id,
			agentId: this.agentId,
			subject: this.subject,
			createdAt: this.createdAt,
			state: this.state,
			inferenceRequest: this.inferenceRequest,
			pendingOperation: this.pendingOperation,
			transitionHistory: [...this.transitionHistory],
			operationHistory: [...this.operationHistory],
			rules: [...this.rules],
		}
	}

	moveToIdle(reason: string, transitionId: string): void {
		const occurredAt = SystemClock.now()
		this.transitionTo("idle", reason, transitionId)
		this.pendingOperation = undefined
	}

	moveToAwaitingInference(operation: PendingInference): void {
		this.assertAwaitingInferenceRequest()
		this.pendingOperation = operation

		this.transitionTo("awaiting_inference", "inference_requested", operation.id)
	}

	moveToAwaitingToolOutput(operation: Extract<PendingOperation, { type: "tool_execution" }>, occurredAt: Date): void {
		this.assertIdle()
		this.pendingOperation = operation

		this.transitionTo("awaiting_tool_output", "tool_execution_requested", operation.id)
	}

	requestInference(request: InferenceRequest): PendingInference {
		this.assertAwaitingInferenceRequest()
		this.inferenceRequest = request
		const operation: PendingInference = {
			id: UuidGenerator.create(),
			type: "inference",
			requestedAt: SystemClock.now(),
			request: this.inferenceRequest,
		}

		this.moveToAwaitingInference(operation)

		return operation
	}

	requestToolUse(operationId: string, call: ToolUseRequest, requestedAt: Date): PendingToolExecution {
		this.assertIdle()

		const operation: PendingToolExecution = {
			id: operationId,
			type: "tool_execution",
			requestedAt,
			call,
		}

		this.moveToAwaitingToolOutput(operation, requestedAt)

		return operation
	}

	private transitionTo(nextState: LoopStateId, reason: string, operationId?: string): void {
		const occurredAt = SystemClock.now()
		const previousState = this.state
		this.state = nextState

		this.transitionHistory.push({
			occurredAt,
			previousState,
			nextState,
			reason,
			operationId,
		})
	}

	private assertIdle(): void {
		if (this.state !== "idle") {
			throw new Error(`Expected idle loop, but loop is ${this.state}`)
		}
	}

	private assertAwaitingInferenceRequest(): void {
		if (this.state !== "awaiting_inference_request") {
			throw new Error(`Expected awaiting inference request loop, but loop is ${this.state}`)
		}
	}

	receiveInferenceResult(operationId: string, result: InferenceResult): void {
		if (this.state !== "awaiting_inference") {
			throw new Error(`Cannot receive inference result while loop is ${this.state}`)
		}

		const operation = this.pendingOperation

		if (operation?.type !== "inference" || operation.id !== operationId) {
			throw new Error(`Inference result does not match pending operation ${operationId}`)
		}

		if (!this.inferenceRequest) {
			throw new Error("Inference request is not provided")
		}
		this.moveToIdle("inference_completed", operationId)

		this.operationHistory.push({
			type: "inference",
			operationId,
			requestedAt: operation.requestedAt,
			completedAt: SystemClock.now(),
			request: operation.request,
			result,
		})

		this.inferenceRequest.context.items.push(...result.items)

		const call = result.items.find((item): item is ToolUseRequest => item.type === "tool_use_request")

		if (call) {
			this.pendingOperation = {
				id: call.requestId,
				type: "tool_execution",
				requestedAt: SystemClock.now(),
				call,
			}

			this.transitionTo("awaiting_tool_output", "tool_use_requested", call.requestId)
			return
		}

		this.pendingOperation = undefined
	}

	receiveToolUseResult(operationId: string, result: ToolUseResult): void {
		if (this.state !== "awaiting_tool_output") {
			throw new Error(`Cannot receive tool output while loop is ${this.state}`)
		}

		const operation = this.pendingOperation

		if (operation?.type !== "tool_execution" || operation.id !== operationId) {
			throw new Error(`Tool output does not match pending operation ${operationId}`)
		}

		if (!this.inferenceRequest) {
			throw new Error("Inference request is not provided")
		}

		this.operationHistory.push({
			type: "tool_use",
			operationId,
			requestedAt: operation.requestedAt,
			completedAt: SystemClock.now(),
			call: operation.call,
			result,
		})

		this.inferenceRequest.context.items.push(result)

		this.pendingOperation = undefined

		this.transitionTo("awaiting_inference_request", "tool_use_completed", operationId)
	}

	complete(reason: string): void {
		this.assertNotSettled("complete")
		this.pendingOperation = undefined
		this.transitionTo("completed", reason)
	}

	stop(reason: string): void {
		this.assertNotSettled("stop")
		this.pendingOperation = undefined
		this.transitionTo("stopped", reason)
	}

	private assertNotSettled(intent: string): void {
		if (this.state === "completed" || this.state === "stopped") {
			throw new Error(`Cannot ${intent} a loop that is already ${this.state}`)
		}
	}

	static create(
		id: string,
		agentId: string,
		subject: string,
		createdAt: Date,
		rules: LoopRule[],
		executionStrategy: "manual" | "auto",
	): Loop {
		return new Loop(
			id,
			agentId,
			subject,
			createdAt,
			"awaiting_inference_request",
			undefined,
			undefined,
			[],
			[],
			rules,
		)
	}

	static rehydrate(record: LoopRecord): Loop {
		return new Loop(
			record.id,
			record.agentId,
			record.subject,
			record.createdAt,
			record.state,
			record.inferenceRequest,
			record.pendingOperation,
			[...record.transitionHistory],
			[...record.operationHistory],
			[...record.rules],
		)
	}
}
