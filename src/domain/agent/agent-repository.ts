import { Agent } from "@domain/agent/agent"

export interface AgentRepository {
	save(agent: Agent): Promise<void>
	getById(id: string): Promise<Agent | undefined>
	exists(id: string): Promise<boolean>
	getAll(): Promise<Agent[]>
}
