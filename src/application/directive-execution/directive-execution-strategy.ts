import { Agent } from "@domain/agent/agent"
import { LoopControlDirective } from "@domain/agent/loop/directive"
import { Loop } from "@domain/agent/loop/loop"

export interface DirectiveExecutionStrategy {
	execute(directive: LoopControlDirective, agent: Agent, loop: Loop): Promise<void>
}
