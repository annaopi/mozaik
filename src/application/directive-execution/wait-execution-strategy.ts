import { LoopControlDirective } from "@domain/agent/loop/directive"
import { DirectiveExecutionStrategy } from "./directive-execution-strategy"
import { Agent } from "@domain/agent/agent"
import { Loop } from "@domain/agent/loop/loop"

export class WaitExecutionStrategy implements DirectiveExecutionStrategy {
	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "wait") {
			throw new Error("Expected a wait directive")
		}

		loop.wait(directive.reason)
	}
}
