import { Tool } from "@domain/inference/tool"
import { Memory } from "@domain/agent/memory"

export type AgentRecord = {
	id: string
	name: string
	instruction: string
	tools: Tool[]
	memory: Memory
}
