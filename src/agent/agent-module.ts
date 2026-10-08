import { CreateAgentUseCase } from "@agent/application/use-cases/create-agent"
import { InMemoryAgentRepository } from "@agent/infrastructure/repositories/in-memory-agent-repository"
import { CreateAgentLoopUseCase } from "@agent/application/use-cases/create-loop"
import { InMemoryLoopRepository } from "@agent/infrastructure/repositories/in-memory-loop-repository"
import { LocalToolRunner } from "@agent/application/runners/local-tool-runner"
import { DefaultInferenceRunner } from "@agent/application/runners/inference-runner"
import { InferenceRequestValidator } from "@inference/request-validation/inference-request-validator"
import { supportedModels } from "@agent/infrastructure/providers/supported-models"
import { CreateLoopParams, Loop } from "@agent/domain/loop/loop"
import { RunLoopUseCase } from "@agent/application/use-cases/run-loop"
import { DirectiveExecutionStrategyResolver } from "src/agent/application/directive-execution/directive-execution-strategy-resolver"
import { CompleteExecutionStrategy } from "@agent/application/directive-execution/complete-execution-strategy"
import { InferenceExecutionStrategy } from "@agent/application/directive-execution/inference-execution-strategy"
import { ToolUseExecutionStrategy } from "@agent/application/directive-execution/tool-use-execution-strategy"
import { WaitExecutionStrategy } from "@agent/application/directive-execution/wait-execution-strategy"
import { Agent } from "@agent/domain/agent"
import { RuntimeMemoryFactory } from "./infrastructure/memory/runtime-memory-factory"
import { AgentModule, AgentModuleConfig, CreateAgentParams } from "@agent/types"

let module: AgentModule | undefined

function initAgentModule(config: AgentModuleConfig = {}) {
	if (module) {
		throw new Error("Agent module already initialized")
	}

	const agentRepository = config.agentRepository ?? new InMemoryAgentRepository()
	const agentLoopRepository = config.agentLoopRepository ?? new InMemoryLoopRepository()

	const inferenceRunner =
		config.inferenceRunnerConfig?.runner ??
		new DefaultInferenceRunner(
			config.inferenceRunnerConfig?.supportedModels ?? supportedModels,
			new InferenceRequestValidator(),
		)

	const toolRunner = config.toolRunner ?? new LocalToolRunner()

	const memoryFactory = config.memoryFactory ?? new RuntimeMemoryFactory()

	module = {
		agentRepository,
		agentLoopRepository,
		inferenceRunner,
		toolRunner,
		memoryFactory,
	}
}

function resolveAgentModule(): AgentModule {
	if (!module) {
		throw new Error("Agent module is not initialized")
	}

	return module
}

async function createAgent(config: CreateAgentParams): Promise<Agent> {
	const { agentRepository, memoryFactory } = resolveAgentModule()
	const createAgentUseCase = new CreateAgentUseCase(agentRepository, memoryFactory)
	return await createAgentUseCase.execute(config.name, config.instruction, config.tools)
}

async function createLoop(params: CreateLoopParams): Promise<Loop> {
	const { agentLoopRepository } = resolveAgentModule()
	const createLoopUseCase = new CreateAgentLoopUseCase(agentLoopRepository)
	return await createLoopUseCase.execute(params)
}

async function runLoop(loopId: string): Promise<Loop> {
	const { agentRepository, agentLoopRepository, inferenceRunner, toolRunner } = resolveAgentModule()
	const directiveExecutionStrategyResolver = new DirectiveExecutionStrategyResolver({
		inference: new InferenceExecutionStrategy(inferenceRunner),
		tool_use: new ToolUseExecutionStrategy(toolRunner),
		complete: new CompleteExecutionStrategy(),
		wait: new WaitExecutionStrategy(),
	})

	const runLoopUseCase = new RunLoopUseCase(agentRepository, agentLoopRepository, directiveExecutionStrategyResolver)
	return await runLoopUseCase.execute(loopId)
}

export { initAgentModule, createAgent, createLoop, runLoop }
