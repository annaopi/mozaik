import { Space } from "@domain/space/space"
import { SpaceRepository } from "@domain/space/space-repository"
import { Participant } from "@domain/space/participant"

export class CreateSpaceUseCase {
	private readonly spaceRepository: SpaceRepository

	constructor(spaceRepository: SpaceRepository) {
		this.spaceRepository = spaceRepository
	}

	async execute(name: string): Promise<Space> {
		const participants: Participant[] = []
		const space = Space.create(name, participants)

		await this.spaceRepository.save(space)
		return space
	}
}
