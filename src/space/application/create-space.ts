import { Space } from "@space/domain/space"
import { SpaceRepository } from "@space/domain/space-repository"
import { Participant } from "@space/domain/participant"

export class CreateSpaceUseCase {
	private readonly spaceRepository: SpaceRepository

	constructor(spaceRepository: SpaceRepository) {
		this.spaceRepository = spaceRepository
	}

	async execute(name: string): Promise<Space> {
		const participants: Participant<any>[] = []
		const space = Space.create(name, participants)

		await this.spaceRepository.save(space)
		return space
	}
}
