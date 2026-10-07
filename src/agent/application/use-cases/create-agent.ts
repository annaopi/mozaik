import { Agent } from "@agent/domain/agent"
import { Tool } from "@inference/tool"
import { AgentRepository } from "@agent/domain/agent-repository"
import { MemoryFactory } from "@agent/domain/memory"

export class CreateAgentUseCase {
	private readonly agentRepository: AgentRepository
	private readonly memoryFactory: MemoryFactory

	constructor(agentRepository: AgentRepository, memoryFactory: MemoryFactory) {
		this.agentRepository = agentRepository
		this.memoryFactory = memoryFactory
	}

	async execute(name: string, instruction: string, tools: Tool[]): Promise<Agent> {
		const memory = this.memoryFactory.create()

		const agent = Agent.create({ name, instruction, tools, memory })
		await this.agentRepository.save(agent)
		return agent
	}
}
