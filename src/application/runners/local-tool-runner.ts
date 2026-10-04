import { ToolUseRequest, ToolUseResult } from "@domain/inference/context"
import { ToolUseRunner } from "@domain/inference/tool-use-runner"
import { Tool } from "@domain/inference/tool"
import { ToolUseItemFactory } from "@domain/inference/tool-use-item-factory"

export class LocalToolRunner implements ToolUseRunner {
	private readonly toolUseItemFactory = new ToolUseItemFactory()

	async run(input: ToolUseRequest, tool: Tool): Promise<ToolUseResult> {
		try {
			const result = await tool.invoke(JSON.parse(input.toolArguments))
			const resultText = typeof result === "string" ? result : JSON.stringify(result)
			return this.toolUseItemFactory.create(input, resultText)
		} catch (error) {
			const errorText = `Error calling tool: ${error}`
			return this.toolUseItemFactory.create(input, errorText)
		}
	}
}
