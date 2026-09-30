import { Loop } from "@agent/loop"
import { LoopRepository } from "@agent/loop/repository"
import { AgentRepository } from "@agent/agent-repository"
import { Clock } from "@util/clock"
import { IdGenerator } from "@util/id-generator"
import { LoopRule } from "@agent/loop/rule"

export class CreateAgentLoopUseCase {
	constructor(
		private readonly loopRepository: LoopRepository,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	async execute(subject: string, rules: LoopRule[]): Promise<Loop> {
		const loop = Loop.create(this.ids.generate(), subject, this.clock.now(), rules)
		await this.loopRepository.save(loop)
		return loop
	}
}
