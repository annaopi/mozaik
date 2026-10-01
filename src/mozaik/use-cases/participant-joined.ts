import { SpaceRepository } from "src/space/space-repository"
import { EventPublisher } from "src/space/event-publisher"

export class ParticipantJoinedUseCase {
	private readonly spaceRepository: SpaceRepository
	private readonly eventPublisher: EventPublisher

	constructor(spaceRepository: SpaceRepository, eventPublisher: EventPublisher) {
		this.spaceRepository = spaceRepository
		this.eventPublisher = eventPublisher
	}

	async execute(spaceId: string, participantId: string, occurredAt: Date): Promise<void> {
		const space = await this.spaceRepository.getById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}
		const participant = space.getParticipant(participantId)
		if (!participant) {
			throw new Error("Participant not found")
		}
		const event = space.addParticipant(participant, occurredAt)
		if (event) {
			this.eventPublisher.publish(event, space.getParticipants())
		}
		await this.spaceRepository.save(space)
	}
}
