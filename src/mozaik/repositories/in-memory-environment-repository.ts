import { Environment } from "@environment/environment"
import { EnvironmentRepository } from "@environment/environment-repository"

export class InMemoryEnvironmentRepository implements EnvironmentRepository {
	private environments: Environment[] = []

	async save(environment: Environment): Promise<void> {
		this.environments.push(environment)
	}

	async getById(id: string): Promise<Environment | undefined> {
		return this.environments.find((environment) => environment.getId() === id)
	}

	async getAllByOwnerId(ownerId: string): Promise<Environment[]> {
		return this.environments.filter((environment) => environment.getOwnerId() === ownerId)
	}

	async delete(id: string): Promise<void> {
		this.environments = this.environments.filter((environment) => environment.getId() !== id)
	}
}
