import { SpaceRepository } from "@space/domain/space-repository"
import { EventPublisher } from "@space/domain/event-publisher"
import { SpaceEvent } from "@util/space-event"

export class SendEventUseCase {
	constructor(
		private readonly spaceRepository: SpaceRepository,
		private readonly eventPublisher: EventPublisher,
	) {}

	async execute(spaceId: string, participantId: string, event: SpaceEvent): Promise<void> {
		const space = await this.spaceRepository.findById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}
		const participant = space.getParticipant(participantId)
		if (!participant) {
			throw new Error("Participant not found")
		}
		space.addEvent(event)
		this.eventPublisher.publish(event, space.getParticipants())

		await this.spaceRepository.save(space)
	}
}
