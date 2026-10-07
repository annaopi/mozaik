import { AgentRepository } from "@agent/domain/agent-repository"
import { RuleEngine } from "@agent/domain/loop/rule-engine"
import { LoopRepository } from "@agent/domain/loop/repository"
import { DirectiveExecutionStrategyResolver } from "@agent/application/directive-execution/directive-execution-strategy-resolver"
import { Loop } from "@agent/domain/loop/loop"

export class RunLoopUseCase {
	private readonly ruleEngine: RuleEngine

	constructor(
		private readonly agentRepository: AgentRepository,
		private readonly loopRepository: LoopRepository,
		private readonly directiveExecutionStrategyResolver: DirectiveExecutionStrategyResolver,
	) {
		this.ruleEngine = new RuleEngine()
	}

	async execute(loopId: string): Promise<Loop> {
		const loop = await this.loopRepository.findById(loopId)
		if (!loop) {
			throw new Error("Loop not found")
		}

		const agent = await this.agentRepository.findById(loop.getAgentId())
		if (!agent) {
			throw new Error("Agent not found")
		}

		while (loop.stateId !== "completed") {
			const directive = this.ruleEngine.decide(agent, loop)

			if (!directive) return loop

			const strategy = this.directiveExecutionStrategyResolver.resolve(directive)
			await strategy.execute(directive, agent, loop)
		}

		await this.loopRepository.save(loop)

		return loop
	}
}
