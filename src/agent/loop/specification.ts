import { Agent } from "@agent/agent"
import { Loop } from "@agent/loop"

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
