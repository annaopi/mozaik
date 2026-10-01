import { Space } from "src/space/space"
import { SpaceRepository } from "src/space/space-repository"
import { Participant } from "src/space/participant"
import { IdGenerator } from "@util/id-generator"

export class CreateSpaceUseCase {
	private readonly spaceRepository: SpaceRepository
	private readonly idGenerator: IdGenerator

	constructor(spaceRepository: SpaceRepository, idGenerator: IdGenerator) {
		this.spaceRepository = spaceRepository
		this.idGenerator = idGenerator
	}

	async execute(name: string, ownerId: string, participants: Participant[]): Promise<Space> {
		const spaceId = this.idGenerator.generate()
		const space = Space.create(spaceId, name, ownerId, participants)

		await this.spaceRepository.save(space)
		return space
	}
}
