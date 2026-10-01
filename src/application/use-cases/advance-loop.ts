import { AgentRepository } from "@domain/agent/agent-repository"
import { Loop } from "@domain/agent/loop/loop"
import { LoopControlDirective } from "@domain/agent/loop/directive"
import { RuleEngine } from "@domain/agent/loop/rule-book"
import { LoopRepository } from "@domain/agent/loop/repository"
import { InferenceRunner } from "@domain/inference/inference-runner"
import { ToolUseRunner } from "@domain/inference/tool-use-runner"
import { Agent } from "@domain/agent/agent"

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
	) {
		this.ruleEngine = new RuleEngine()
	}

	private async iterateLoop(agent: Agent, loop: Loop) {
		const directive = this.ruleEngine.decide(agent, loop)

		if (!directive) {
			return
		}

		if (directive.type === "inference") {
			const pending = loop.requestInference(directive.request)
			const result = await this.inferenceRunner.run(directive.request)
			loop.receiveInferenceResult(pending.id, result)
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
			loop.receiveToolUseResult(pending.id, result)
		} else if (directive.type === "complete") {
			loop.complete(directive.reason)
		}
	}

	async execute(loopId: string): Promise<Loop> {
		const loop = await this.loopRepository.getById(loopId)
		if (!loop) {
			throw new Error("Loop not found")
		}

		const agent = await this.agentRepository.getById(loop.getAgentId())
		if (!agent) {
			throw new Error("Agent not found")
		}

		if (loop.strategy === "manual") {
			await this.iterateLoop(agent, loop)
		} else {
			while (loop.stateId !== "completed") {
				await this.iterateLoop(agent, loop)
			}
		}

		await this.loopRepository.save(loop)

		return loop
	}
}
