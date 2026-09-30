import { EnvironmentRepository } from "@environment/environment-repository"
import { EventPublisher } from "@environment/event-publisher"

export class SendMessageUseCase {
	constructor(
		private readonly environmentRepository: EnvironmentRepository,
		private readonly eventPublisher: EventPublisher,
	) {}

	async execute(environmentId: string, participantId: string, message: string): Promise<void> {
		const environment = await this.environmentRepository.getById(environmentId)
		if (!environment) {
			throw new Error("Environment not found")
		}
		const participant = environment.getParticipant(participantId)
		if (!participant) {
			throw new Error("Participant not found")
		}
		const event = environment.sendMessage(participant, message, new Date())
		if (event) {
			this.eventPublisher.publish(event, environment.getParticipants())
		}
		await this.environmentRepository.save(environment)
	}
}
