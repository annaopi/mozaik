import { Space } from "@domain/space/space"
import { SpaceRepository } from "@domain/space/space-repository"
import { Participant } from "@domain/space/participant"

export class CreateSpaceUseCase {
	private readonly spaceRepository: SpaceRepository

	constructor(spaceRepository: SpaceRepository) {
		this.spaceRepository = spaceRepository
	}

	async execute(name: string, ownerId: string, participants: Participant[]): Promise<Space> {
		const space = Space.create(name, ownerId, participants)

		await this.spaceRepository.save(space)
		return space
	}
}
