import { CreateAgentUseCase } from "@application/use-cases/create-agent"
import { InMemoryAgentRepository } from "@infrastructure/repositories/in-memory-agent-repository"
import { Tool } from "@domain/inference/tool"
import { SituationHandler } from "@domain/space/situation-handler"
import { CreateAgentLoopUseCase } from "@application/use-cases/create-loop"
import { InMemoryLoopRepository } from "@infrastructure/repositories/in-memory-loop-repository"
import { InferenceRunner } from "@domain/inference/inference-runner"
import { AgentRepository } from "@domain/agent/agent-repository"
import { LoopRepository } from "@domain/agent/loop/repository"
import { ToolUseRunner } from "@domain/inference/tool-use-runner"
import { LocalToolRunner } from "@application/runners/local-tool-runner"
import { DefaultInferenceRunner } from "@application/runners/inference-runner"
import { GenerativeModel } from "@domain/inference/generative-model"
import { InferenceRequestValidator } from "@domain/inference/request-validation/inference-request-validator"
import { supportedModels } from "@infrastructure/providers/supported-models"
import { AgentRecord } from "./domain/agent/record"
import { Loop, LoopStateId } from "./domain/agent/loop/loop"
import { RunLoopUseCase } from "@application/use-cases/run-loop"
import { LoopStateUseCase } from "@application/use-cases/loop-state"
import { LoopSpecification, ModelAnswered } from "./domain/agent/loop/specification"
import { CompleteAction, InferenceAction, LoopAction, ToolUseAction } from "./domain/agent/loop/action"
import { CreateLoopRuleParams, LoopRule } from "./domain/agent/loop/rule"
import { RuntimeMemoryFactory } from "@infrastructure/memory/runtime-memory-factory"
import { DirectiveExecutionStrategyResolver } from "@application/directive-execution/directive-execution-strategy-resolver"
import { CompleteExecutionStrategy } from "@application/directive-execution/complete-execution-strategy"
import { InferenceExecutionStrategy } from "@application/directive-execution/inference-execution-strategy"
import { ToolUseExecutionStrategy } from "@application/directive-execution/tool-use-execution-strategy"
import { WaitExecutionStrategy } from "@application/directive-execution/wait-execution-strategy"

export type InferenceRunnerConfig = {
	supportedModels?: GenerativeModel[]
	runner?: InferenceRunner
}

export type AgentFamilyConfig = {
	agentRepository?: AgentRepository
	agentLoopRepository?: LoopRepository
	inferenceRunnerConfig?: InferenceRunnerConfig
	toolRunner: ToolUseRunner
}

export function createAgentModule(config: AgentFamilyConfig) {
	// Dependencies
	const agentRepository = config.agentRepository ?? new InMemoryAgentRepository()
	const agentLoopRepository = config.agentLoopRepository ?? new InMemoryLoopRepository()

	const inferenceRunner =
		config.inferenceRunnerConfig?.runner ??
		new DefaultInferenceRunner(
			config.inferenceRunnerConfig?.supportedModels ?? supportedModels,
			new InferenceRequestValidator(),
		)

	const toolRunner = new LocalToolRunner()

	const memoryFactory = new RuntimeMemoryFactory()
	// Use cases
	const createAgentUseCase = new CreateAgentUseCase(agentRepository, memoryFactory)
	const createLoopUseCase = new CreateAgentLoopUseCase(agentLoopRepository)

	type CreateAgentParams = {
		name: string
		instruction: string
		tools: Tool[]
		handlers: SituationHandler[]
	}
	// Interfaces
	async function createAgent(config: CreateAgentParams): Promise<AgentRecord> {
		return await createAgentUseCase.execute(config.name, config.instruction, config.tools, config.handlers)
	}

	type CreateLoopParams = {
		subject: string
		agentId: string
		rules: CreateLoopRuleParams[]
	}

	async function createLoop(params: CreateLoopParams): Promise<Loop> {
		const rules = params.rules.map((rule) => LoopRule.create(rule))
		return await createLoopUseCase.execute(params.subject, params.agentId, rules)
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

	const getLoopStateUseCase = new LoopStateUseCase()
	function state(loopStateId: LoopStateId): LoopSpecification {
		return getLoopStateUseCase.execute(loopStateId)
	}

	function modelAnswered(): LoopSpecification {
		return new ModelAnswered()
	}

	function runInference(): LoopAction {
		return new InferenceAction()
	}

	function toolUse(): LoopAction {
		return new ToolUseAction()
	}

	function complete(reason?: string): LoopAction {
		return new CompleteAction(reason ?? "loop_completed")
	}

	return {
		createAgent,
		createLoop,
		runLoop,
		state,
		modelAnswered,
		runInference,
		toolUse,
		complete,
	}
}
