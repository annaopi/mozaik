import { LoopControlDirective } from "@agent/domain/loop/directive"
import { DirectiveExecutionStrategy } from "@agent/application/directive-execution/directive-execution-strategy"
import { Agent } from "@agent/domain/agent"
import { Loop } from "@agent/domain/loop/loop"

export class WaitExecutionStrategy implements DirectiveExecutionStrategy {
	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "wait") {
			throw new Error("Expected a wait directive")
		}

		loop.wait(directive.reason)
	}
}
