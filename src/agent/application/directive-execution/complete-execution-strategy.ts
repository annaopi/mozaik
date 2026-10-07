import { LoopControlDirective } from "@agent/domain/loop/directive"
import { DirectiveExecutionStrategy } from "@agent/application/directive-execution/directive-execution-strategy"
import { Loop } from "@agent/domain/loop/loop"
import { Agent } from "@agent/domain/agent"

export class CompleteExecutionStrategy implements DirectiveExecutionStrategy {
	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "complete") {
			throw new Error("Expected a completion directive")
		}

		loop.complete(directive.reason)
	}
}
