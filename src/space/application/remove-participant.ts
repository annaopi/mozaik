import { SpaceRepository } from "@space/domain/space-repository"
import { EventPublisher } from "@space/domain/event-publisher"

export class RemoveParticipantUseCase {
	private readonly spaceRepository: SpaceRepository
	private readonly eventPublisher: EventPublisher

	constructor(spaceRepository: SpaceRepository, eventPublisher: EventPublisher) {
		this.spaceRepository = spaceRepository
		this.eventPublisher = eventPublisher
	}

	async execute(spaceId: string, participantId: string): Promise<void> {
		const space = await this.spaceRepository.findById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}
		const participant = space.getParticipant(participantId)
		if (!participant) {
			throw new Error("Participant not found")
		}
		const event = space.removeParticipant(participant)
		if (event) {
			this.eventPublisher.publish(event, space.getParticipants())
		}
		await this.spaceRepository.save(space)
	}
}
