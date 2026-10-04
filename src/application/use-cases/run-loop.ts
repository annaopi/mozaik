import { AgentRepository } from "@domain/agent/agent-repository"
import { Loop } from "@domain/agent/loop/loop"
import { RuleEngine } from "@domain/agent/loop/rule-engine"
import { LoopRepository } from "@domain/agent/loop/repository"
import { DirectiveExecutionStrategyResolver } from "@application/directive-execution/directive-execution-strategy-resolver"

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
