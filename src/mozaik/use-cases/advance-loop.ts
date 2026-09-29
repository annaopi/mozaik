import { AgentRepository } from "@agent/agent-repository"
import { Loop } from "@agent/loop"
import { RuleEngine } from "@agent/loop/rule-book"
import { LoopRepository } from "@agent/loop/repository"
import { InferenceRunner } from "@inference/inference-runner"
import { ToolUseRunner } from "@inference/tool-use-runner"

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

	async execute(agentId: string, loopId: string): Promise<Loop> {
		const agent = await this.agentRepository.getById(agentId)
		if (!agent) {
			throw new Error("Agent not found")
		}
		const loop = await this.loopRepository.getById(loopId)
		if (!loop) {
			throw new Error("Loop not found")
		}
		const next = this.ruleEngine.decide(agent, loop)
		console.log("decision:", next)

		if (next?.type === "inference") {
			const pending = loop.requestInference("op-1", next.request, new Date())
			const result = await this.inferenceRunner.run(next.request)
			loop.receiveInferenceResult(pending.id, result, new Date())
			console.log("model output:", result.items)
		} else if (next?.type === "tool_use") {
			const tool = agent.getTools().find((tool) => tool.name === next.call.toolName)
			if (!tool) {
				throw new Error(`Tool with name ${next.call.toolName} not found`)
			}
			const result = await this.toolRunner.run(next.call, tool)
			console.log("tool output:", result)
		}

		return loop
	}
}
