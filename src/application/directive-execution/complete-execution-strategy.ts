import { LoopControlDirective } from "@domain/agent/loop/directive"
import { DirectiveExecutionStrategy } from "./directive-execution-strategy"
import { Loop } from "@domain/agent/loop/loop"
import { Agent } from "@domain/agent/agent"

export class CompleteExecutionStrategy implements DirectiveExecutionStrategy {
	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "complete") {
			throw new Error("Expected a completion directive")
		}

		loop.complete(directive.reason)
	}
}
