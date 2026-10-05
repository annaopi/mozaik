import { Agent } from "@domain/agent/agent"
import { Tool } from "@domain/inference/tool"
import { SituationHandler } from "@domain/space/situation-handler"
import { AgentRepository } from "@domain/agent/agent-repository"
import { ParticipantManifest } from "@domain/space/participant"
import { DeveloperMessageItem } from "@domain/inference/context"
import { AgentRecord } from "@domain/agent/record"
import { MemoryFactory } from "@domain/agent/memory"
import { UuidGenerator } from "@util/uuid-generator"

export class CreateAgentUseCase {
	private readonly agentRepository: AgentRepository
	private readonly memoryFactory: MemoryFactory

	constructor(agentRepository: AgentRepository, memoryFactory: MemoryFactory) {
		this.agentRepository = agentRepository
		this.memoryFactory = memoryFactory
	}

	async execute(
		name: string,
		instruction: string,
		tools: Tool[],
		handlers: SituationHandler[],
	): Promise<AgentRecord> {
		const id = UuidGenerator.create()
		const manifest: ParticipantManifest = { id, name, role: "agent" }
		const memory = this.memoryFactory.create()

		const agentRecord: AgentRecord = { id, manifest, tools, memory, handlers }
		const agent = Agent.create(agentRecord)
		await this.agentRepository.save(agent)
		return agentRecord
	}
}
