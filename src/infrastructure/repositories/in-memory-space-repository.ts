import { Space } from "@domain/space/space"
import { SpaceRepository } from "@domain/space/space-repository"

export class InMemorySpaceRepository implements SpaceRepository {
	private spaces: Space[] = []

	async save(space: Space): Promise<void> {
		this.spaces.push(space)
	}

	async findById(id: string): Promise<Space | undefined> {
		return this.spaces.find((space) => space.getId() === id)
	}

	async findAllByOwnerId(ownerId: string): Promise<Space[]> {
		return this.spaces.filter((space) => space.getOwnerId() === ownerId)
	}

	async delete(id: string): Promise<void> {
		this.spaces = this.spaces.filter((space) => space.getId() !== id)
	}
}
