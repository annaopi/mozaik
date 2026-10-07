import { Agent } from "@agent/domain/agent"
import { Loop } from "@agent/domain/loop/loop"
import { ModelOutputItem } from "@inference/context"

export type AgentLoop = {
	readonly agent: Agent
	readonly loop: Loop
}

export abstract class LoopSpecification {
	abstract isSatisfiedBy(agentLoop: AgentLoop): boolean

	and(other: LoopSpecification): LoopSpecification {
		return new AndLoopSpecification(this, other)
	}

	or(other: LoopSpecification): LoopSpecification {
		return new OrLoopSpecification(this, other)
	}

	not(): LoopSpecification {
		return new NotLoopSpecification(this)
	}
}

class AndLoopSpecification extends LoopSpecification {
	constructor(
		private readonly left: LoopSpecification,
		private readonly right: LoopSpecification,
	) {
		super()
	}

	isSatisfiedBy(agentLoop: AgentLoop): boolean {
		return this.left.isSatisfiedBy(agentLoop) && this.right.isSatisfiedBy(agentLoop)
	}
}

class OrLoopSpecification extends LoopSpecification {
	constructor(
		private readonly left: LoopSpecification,
		private readonly right: LoopSpecification,
	) {
		super()
	}

	isSatisfiedBy(agentLoop: AgentLoop): boolean {
		return this.left.isSatisfiedBy(agentLoop) || this.right.isSatisfiedBy(agentLoop)
	}
}

class NotLoopSpecification extends LoopSpecification {
	constructor(private readonly rule: LoopSpecification) {
		super()
	}

	isSatisfiedBy(agentLoop: AgentLoop): boolean {
		return !this.rule.isSatisfiedBy(agentLoop)
	}
}

export class Idle extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "idle"
	}
}

export class AwaitingInference extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "awaiting_inference"
	}
}

export class AwaitingRequest extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "awaiting_inference_request"
	}
}

export class AwaitingToolOutput extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "awaiting_tool_output"
	}
}

export class Stopped extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "stopped"
	}
}

export class Completed extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		return agentLoop.loop.stateId === "completed"
	}
}

export class ModelAnswered extends LoopSpecification {
	isSatisfiedBy(agentLoop: AgentLoop) {
		const operations = agentLoop.loop.completedOperations
		const lastOperation = operations[operations.length - 1]

		if (lastOperation?.type !== "inference") {
			return false
		}

		return lastOperation.result.items.some((item: ModelOutputItem) => item.type === "model_message")
	}
}
