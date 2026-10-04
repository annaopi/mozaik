import { LoopControlDirective } from "@domain/agent/loop/directive"
import { DirectiveExecutionStrategy } from "./directive-execution-strategy"
import { ToolUseRunner } from "@domain/inference/tool-use-runner"
import { Agent } from "@domain/agent/agent"
import { Loop } from "@domain/agent/loop/loop"

export class ToolUseExecutionStrategy implements DirectiveExecutionStrategy {
	constructor(private readonly toolRunner: ToolUseRunner) {}

	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "tool_use") {
			throw new Error("Expected a tool-use directive")
		}

		const pending = loop.pending
		if (pending?.type !== "tool_execution") {
			throw new Error("The loop has no pending tool execution")
		}

		const tool = agent.getTools().find((tool) => tool.name === directive.call.toolName)

		if (!tool) {
			throw new Error(`Tool "${directive.call.toolName}" not found`)
		}

		const result = await this.toolRunner.run(directive.call, tool)

		loop.receiveToolUseResult(pending.id, result)
	}
}
