import { CreateLoopParams, Loop } from "@agent/domain/loop/loop"
import { LoopRepository } from "@agent/domain/loop/repository"
import { defaultRules, RuleBook } from "@agent/domain/loop/rule"

export class CreateAgentLoopUseCase {
	constructor(private readonly loopRepository: LoopRepository) {}

	async execute(params: CreateLoopParams): Promise<Loop> {
		if ("rules" in params) {
			const ruleBook = RuleBook.create(params.rules)
			const loop = Loop.create(params.agentId, params.subject, ruleBook)
			await this.loopRepository.save(loop)
			return loop
		} else {
			const ruleBook = RuleBook.create(defaultRules(params.request))
			const loop = Loop.create(params.agentId, params.subject, ruleBook)
			await this.loopRepository.save(loop)
			return loop
		}
	}
}
