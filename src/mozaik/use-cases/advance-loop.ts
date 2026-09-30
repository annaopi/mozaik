import { Agent } from "@agent/agent"
import { AgentRepository } from "@agent/agent-repository"
import { Loop } from "@agent/loop"
import { LoopControlDirective } from "@agent/loop/directive"
import { RuleEngine } from "@agent/loop/rule-book"
import { LoopRepository } from "@agent/loop/repository"
import { ContextItem, MessageItem } from "@inference/context"
import { InferenceRequest, InferenceRunner } from "@inference/inference-runner"
import { ToolUseRunner } from "@inference/tool-use-runner"
import { Clock } from "@util/clock"
import { IdGenerator } from "@util/id-generator"

export type LoopAdvance = {
	readonly loop: Loop
	readonly directive: LoopControlDirective | undefined
}

export class AdvanceLoopUseCase {
	private readonly ruleEngine: RuleEngine

	constructor(
		private readonly inferenceRunner: InferenceRunner,
		private readonly toolRunner: ToolUseRunner,
		private readonly agentRepository: AgentRepository,
		private readonly loopRepository: LoopRepository,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {
		this.ruleEngine = new RuleEngine()
	}

	async execute(agentId: string, loopId: string): Promise<LoopAdvance> {
		const agent = await this.agentRepository.getById(agentId)
		if (!agent) {
			throw new Error("Agent not found")
		}
		const loop = await this.loopRepository.getById(loopId)
		if (!loop) {
			throw new Error("Loop not found")
		}

		const directive = this.ruleEngine.decide(agent, loop)

		if (!directive) {
			return { loop, directive }
		}

		if (directive.type === "inference") {
			const request = this.grounded(agent, directive.request)
			const pending = loop.requestInference(this.ids.generate(), request, this.clock.now())
			const result = await this.inferenceRunner.run(request)
			loop.receiveInferenceResult(pending.id, result, this.clock.now())
		} else if (directive.type === "tool_use") {
			const pending = loop.pending
			if (pending?.type !== "tool_execution") {
				throw new Error("Tool use was directed, but the loop has no pending tool execution")
			}
			const tool = agent.getTools().find((tool) => tool.name === directive.call.toolName)
			if (!tool) {
				throw new Error(`Tool with name ${directive.call.toolName} not found`)
			}
			const result = await this.toolRunner.run(directive.call, tool)
			loop.receiveToolUseResult(pending.id, result, this.clock.now())
		} else if (directive.type === "complete") {
			loop.complete(directive.reason, this.clock.now())
		}

		await this.loopRepository.save(loop)

		return { loop, directive }
	}

	// Mutates the directed request instead of copying it: the loop appends every
	// inference and tool result to this same request, so a fresh object per turn
	// would drop the context accumulated by earlier turns.
	private grounded(agent: Agent, request: InferenceRequest): InferenceRequest {
		const tools = agent.getTools()
		if (request.tools === undefined && tools.length > 0) {
			request.tools = tools
		}

		const instructions = agent
			.getMemory()
			.getContext()
			.items.filter((instruction: ContextItem) => !isInContext(request.context.items, instruction))

		request.context.items.unshift(...instructions)

		return request
	}
}

function isInContext(items: readonly ContextItem[], candidate: ContextItem): boolean {
	return items.some((item) => {
		if (item === candidate) {
			return true
		}

		if (item.type !== candidate.type) {
			return false
		}

		return isMessage(item) && isMessage(candidate) && item.text === candidate.text
	})
}

function isMessage(item: ContextItem): item is MessageItem {
	return "text" in item
}
