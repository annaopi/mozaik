import { Tool } from "@inference/tool"
import { Memory } from "@agent/domain/memory"

export type AgentRecord = {
	id: string
	name: string
	instruction: string
	tools: Tool[]
	memory: Memory
}
