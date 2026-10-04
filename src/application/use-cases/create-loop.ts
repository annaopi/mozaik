import { Loop } from "@domain/agent/loop/loop"
import { LoopRepository } from "@domain/agent/loop/repository"
import { LoopRule } from "@domain/agent/loop/rule"
import { UuidGenerator } from "@util/uuid-generator"

export class CreateAgentLoopUseCase {
	constructor(private readonly loopRepository: LoopRepository) {}

	async execute(subject: string, agentId: string, rules: LoopRule[]): Promise<Loop> {
		const loop = Loop.create(UuidGenerator.create(), agentId, subject, rules)
		await this.loopRepository.save(loop)
		return loop
	}
}
