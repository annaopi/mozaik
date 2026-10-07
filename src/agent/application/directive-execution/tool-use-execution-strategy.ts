import { LoopControlDirective } from "@agent/domain/loop/directive"
import { DirectiveExecutionStrategy } from "@agent/application/directive-execution/directive-execution-strategy"
import { ToolUseRunner } from "@inference/tool-use-runner"
import { Agent } from "@agent/domain/agent"
import { Loop } from "@agent/domain/loop/loop"
import { Tool } from "@inference/tool"

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

		const tool = agent.tools.find((tool: Tool) => tool.name === directive.call.toolName)

		if (!tool) {
			throw new Error(`Tool "${directive.call.toolName}" not found`)
		}

		const result = await this.toolRunner.run(directive.call, tool)

		loop.receiveToolUseResult(pending.id, result)
	}
}
