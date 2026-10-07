import { CreateAgentUseCase } from "@agent/application/use-cases/create-agent"
import { InMemoryAgentRepository } from "@agent/infrastructure/repositories/in-memory-agent-repository"
import { Tool } from "@inference/tool"
import { CreateAgentLoopUseCase } from "@agent/application/use-cases/create-loop"
import { InMemoryLoopRepository } from "@agent/infrastructure/repositories/in-memory-loop-repository"
import { InferenceRunner } from "@inference/inference-runner"
import { AgentRepository } from "@agent/domain/agent-repository"
import { LoopRepository } from "@agent/domain/loop/repository"
import { ToolUseRunner } from "@inference/tool-use-runner"
import { LocalToolRunner } from "@agent/application/runners/local-tool-runner"
import { DefaultInferenceRunner } from "@agent/application/runners/inference-runner"
import { GenerativeModel } from "@inference/generative-model"
import { InferenceRequestValidator } from "@inference/request-validation/inference-request-validator"
import { supportedModels } from "@agent/infrastructure/providers/supported-models"
import { CreateLoopParams, Loop } from "@agent/domain/loop/loop"
import { RunLoopUseCase } from "@agent/application/use-cases/run-loop"
import { RuntimeMemoryFactory } from "@agent/infrastructure/memory/runtime-memory-factory"
import { DirectiveExecutionStrategyResolver } from "src/agent/application/directive-execution/directive-execution-strategy-resolver"
import { CompleteExecutionStrategy } from "@agent/application/directive-execution/complete-execution-strategy"
import { InferenceExecutionStrategy } from "@agent/application/directive-execution/inference-execution-strategy"
import { ToolUseExecutionStrategy } from "@agent/application/directive-execution/tool-use-execution-strategy"
import { WaitExecutionStrategy } from "@agent/application/directive-execution/wait-execution-strategy"
import { Agent } from "@agent/domain/agent"

export type InferenceRunnerConfig = {
	supportedModels?: GenerativeModel[]
	runner?: InferenceRunner
}

export type AgentModuleConfig = {
	agentRepository?: AgentRepository
	agentLoopRepository?: LoopRepository
	inferenceRunnerConfig?: InferenceRunnerConfig
	toolRunner?: ToolUseRunner
}

export function defineAgentModule(config: AgentModuleConfig = {}) {
	// Dependencies
	const agentRepository = config.agentRepository ?? new InMemoryAgentRepository()
	const agentLoopRepository = config.agentLoopRepository ?? new InMemoryLoopRepository()

	const inferenceRunner =
		config.inferenceRunnerConfig?.runner ??
		new DefaultInferenceRunner(
			config.inferenceRunnerConfig?.supportedModels ?? supportedModels,
			new InferenceRequestValidator(),
		)

	const toolRunner = config.toolRunner ?? new LocalToolRunner()

	const memoryFactory = new RuntimeMemoryFactory()
	// Use cases
	const createAgentUseCase = new CreateAgentUseCase(agentRepository, memoryFactory)
	const createLoopUseCase = new CreateAgentLoopUseCase(agentLoopRepository)

	type CreateAgentParams = {
		name: string
		instruction: string
		tools: Tool[]
	}
	// Interfaces
	async function createAgent(config: CreateAgentParams): Promise<Agent> {
		return await createAgentUseCase.execute(config.name, config.instruction, config.tools)
	}

	async function createLoop(params: CreateLoopParams): Promise<Loop> {
		return await createLoopUseCase.execute(params)
	}

	const directiveExecutionStrategyResolver = new DirectiveExecutionStrategyResolver({
		inference: new InferenceExecutionStrategy(inferenceRunner),
		tool_use: new ToolUseExecutionStrategy(toolRunner),
		complete: new CompleteExecutionStrategy(),
		wait: new WaitExecutionStrategy(),
	})

	const runLoopUseCase = new RunLoopUseCase(agentRepository, agentLoopRepository, directiveExecutionStrategyResolver)

	async function runLoop(loopId: string): Promise<Loop> {
		return await runLoopUseCase.execute(loopId)
	}

	return {
		createAgent,
		createLoop,
		runLoop,
	}
}
