import { AgentRepository } from "@agent/agent-repository"
import { Loop } from "@agent/loop"
import { LoopControlDirective } from "@agent/loop/directive"
import { RuleEngine } from "@agent/loop/rule-book"
import { LoopRepository } from "@agent/loop/repository"
import { InferenceRunner } from "@inference/inference-runner"
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
			const pending = loop.requestInference(this.ids.generate(), directive.request, this.clock.now())
			const result = await this.inferenceRunner.run(directive.request)
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
}
