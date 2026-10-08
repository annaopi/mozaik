import { MemoryFactory } from "@agent/domain/memory"
import { GenerativeModel } from "@inference/generative-model"
import { InferenceRunner } from "@inference/inference-runner"
import { ToolUseRunner } from "@inference/tool-use-runner"
import { AgentRepository } from "@agent/domain/agent-repository"
import { LoopRepository } from "@agent/domain/loop/repository"
import { Tool } from "@inference/tool"

type InferenceRunnerConfig = {
	supportedModels?: GenerativeModel[]
	runner?: InferenceRunner
}

type AgentModuleConfig = {
	agentRepository?: AgentRepository
	agentLoopRepository?: LoopRepository
	inferenceRunnerConfig?: InferenceRunnerConfig
	toolRunner?: ToolUseRunner
	memoryFactory?: MemoryFactory
}

type AgentModule = {
	agentRepository: AgentRepository
	agentLoopRepository: LoopRepository
	inferenceRunner: InferenceRunner
	toolRunner: ToolUseRunner
	memoryFactory: MemoryFactory
}

type CreateAgentParams = {
	name: string
	instruction: string
	tools: Tool[]
}

export type { InferenceRunnerConfig, AgentModuleConfig, AgentModule, CreateAgentParams }
