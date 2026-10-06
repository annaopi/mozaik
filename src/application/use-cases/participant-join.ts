import { SpaceRepository } from "@domain/space/space-repository"
import { EventPublisher } from "@domain/space/event-publisher"
import { Participant } from "@domain/space/participant"

export class ParticipantJoinUseCase {
	private readonly spaceRepository: SpaceRepository
	private readonly eventPublisher: EventPublisher

	constructor(spaceRepository: SpaceRepository, eventPublisher: EventPublisher) {
		this.spaceRepository = spaceRepository
		this.eventPublisher = eventPublisher
	}

	async execute(spaceId: string, participant: Participant<unknown>): Promise<void> {
		const space = await this.spaceRepository.findById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}
		const existingParticipant = space.getParticipant(participant.getId())
		if (existingParticipant) {
			throw new Error("Participant already joined")
		}
		const event = space.addParticipant(participant)
		if (event) {
			this.eventPublisher.publish(event, space.getParticipants())
		}
		await this.spaceRepository.save(space)
	}
}
