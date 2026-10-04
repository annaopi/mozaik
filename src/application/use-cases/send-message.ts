import { SpaceRepository } from "@domain/space/space-repository"
import { EventPublisher } from "@domain/space/event-publisher"

export class SendMessageUseCase {
	constructor(
		private readonly spaceRepository: SpaceRepository,
		private readonly eventPublisher: EventPublisher,
	) {}

	async execute(spaceId: string, participantId: string, message: string): Promise<void> {
		const space = await this.spaceRepository.findById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}
		const participant = space.getParticipant(participantId)
		if (!participant) {
			throw new Error("Participant not found")
		}
		const event = space.sendMessage(participant, message, new Date())
		if (event) {
			this.eventPublisher.publish(event, space.getParticipants())
		}
		await this.spaceRepository.save(space)
	}
}
