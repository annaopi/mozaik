import { Agent } from "@agent/domain/agent"
import { LoopControlDirective } from "@agent/domain/loop/directive"
import { Loop } from "@agent/domain/loop/loop"

export interface DirectiveExecutionStrategy {
	execute(directive: LoopControlDirective, agent: Agent, loop: Loop): Promise<void>
}
