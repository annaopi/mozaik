import { UuidGenerator } from "@util/uuid-generator"
import { CreateAgentUseCase } from "src/mozaik/use-cases/create-agent"
import { InMemoryAgentRepository } from "src/mozaik/repositories/in-memory-agent-repository"
import { Tool } from "@inference/tool"
import { SituationHandler } from "@environment/situation-handler"
import { CreateAgentLoopUseCase } from "src/mozaik/use-cases/create-loop"
import { SystemClock } from "@util/system-clock"
import { InMemoryLoopRepository } from "src/mozaik/repositories/in-memory-loop-repository"
import { InferenceRequest, InferenceRunner } from "@inference/inference-runner"
import { AgentRepository } from "@agent/agent-repository"
import { LoopRepository } from "@agent/loop/repository"
import { Clock } from "@util/clock"
import { IdGenerator } from "@util/id-generator"
import { ToolUseRunner } from "@inference/tool-use-runner"
import { LocalToolRunner } from "src/mozaik/runners/local-tool-runner"
import { DefaultInferenceRunner } from "src/mozaik/runners/inference-runner"
import { GenerativeModel } from "@inference/generative-model"
import { InferenceRequestValidator } from "@inference/request-validation/inference-request-validator"
import { supportedModels } from "@inference/models"
import { AgentRecord } from "./record"
import { Loop, LoopStateId } from "./loop"
import { AdvanceLoopUseCase, LoopAdvance } from "src/mozaik/use-cases/advance-loop"
import { LoopStateUseCase } from "src/mozaik/use-cases/loop-state"
import { LoopSpecification, ModelAnswered } from "./loop/specification"
import { CompleteAction, InferenceAction, LoopAction, ToolUseAction } from "./loop/action"
import { CreateLoopRuleParams, LoopRule } from "./loop/rule"

export type InferenceRunnerConfig = {
	supportedModels?: GenerativeModel[]
	runner?: InferenceRunner
}

export type AgentFamilyConfig = {
	agentRepository?: AgentRepository
	agentLoopRepository?: LoopRepository
	clock?: Clock
	uuidGenerator?: IdGenerator
	inferenceRunnerConfig?: InferenceRunnerConfig
	toolRunner: ToolUseRunner
}

export function createAgentModule(config: AgentFamilyConfig) {
	// Dependencies
	const agentRepository = config.agentRepository ?? new InMemoryAgentRepository()
	const uuidGenerator = config.uuidGenerator ?? new UuidGenerator()
	const agentLoopRepository = config.agentLoopRepository ?? new InMemoryLoopRepository()
	const clock = config.clock ?? new SystemClock()

	const inferenceRunner =
		config.inferenceRunnerConfig?.runner ??
		new DefaultInferenceRunner(
			config.inferenceRunnerConfig?.supportedModels ?? supportedModels,
			new InferenceRequestValidator(),
		)

	const toolRunner = new LocalToolRunner()

	// Use cases
	const createAgentUseCase = new CreateAgentUseCase(agentRepository, uuidGenerator)
	const createLoopUseCase = new CreateAgentLoopUseCase(agentLoopRepository, uuidGenerator, clock)

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
		rules: CreateLoopRuleParams[]
	}

	async function createLoop(config: CreateLoopParams): Promise<Loop> {
		const rules = config.rules.map((rule) => LoopRule.create(rule))
		return await createLoopUseCase.execute(config.subject, rules)
	}

	const advanceLoopUseCase = new AdvanceLoopUseCase(
		inferenceRunner,
		toolRunner,
		agentRepository,
		agentLoopRepository,
		uuidGenerator,
		clock,
	)
	async function advanceLoop(agentId: string, loopId: string): Promise<LoopAdvance> {
		return await advanceLoopUseCase.execute(agentId, loopId)
	}

	const getLoopStateUseCase = new LoopStateUseCase()
	function state(loopStateId: LoopStateId): LoopSpecification {
		return getLoopStateUseCase.execute(loopStateId)
	}

	function modelAnswered(): LoopSpecification {
		return new ModelAnswered()
	}

	function inference(request: InferenceRequest): LoopAction {
		return new InferenceAction(request)
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
		advanceLoop,
		state,
		modelAnswered,
		inference,
		toolUse,
		complete,
	}
}
