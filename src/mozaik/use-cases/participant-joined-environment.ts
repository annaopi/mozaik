import { EnvironmentRepository } from "@environment/environment-repository"
import { Participant } from "@environment/participant"
import { EventPublisher } from "@environment/event-publisher"

export class ParticipantJoinedEnvironmentUseCase {
	private readonly environmentRepository: EnvironmentRepository
	private readonly eventPublisher: EventPublisher

	constructor(environmentRepository: EnvironmentRepository, eventPublisher: EventPublisher) {
		this.environmentRepository = environmentRepository
		this.eventPublisher = eventPublisher
	}

	async execute(environmentId: string, participant: Participant, occurredAt: Date): Promise<void> {
		const environment = await this.environmentRepository.getById(environmentId)
		if (!environment) {
			throw new Error("Environment not found")
		}
		const event = environment.addParticipant(participant, occurredAt)
		if (event) {
			this.eventPublisher.publish(event, environment.getParticipants())
		}
		await this.environmentRepository.save(environment)
	}
}
