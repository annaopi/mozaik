import { Environment } from "@environment/environment"

export interface EnvironmentRepository {
	save(environment: Environment): Promise<void>
	delete(id: string): Promise<void>
	getById(id: string): Promise<Environment | undefined>
	getAllByOwnerId(ownerId: string): Promise<Environment[]>
}
