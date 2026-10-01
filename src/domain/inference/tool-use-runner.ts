import { ToolUseRequest, ToolUseResult } from "@domain/inference/context"
import { Tool } from "@domain/inference/tool"

export interface ToolUseRunner {
	run(request: ToolUseRequest, tool: Tool): Promise<ToolUseResult>
}
