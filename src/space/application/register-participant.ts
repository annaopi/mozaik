import { SpaceRepository } from "@space/domain/space-repository"
import { EventPublisher } from "@space/domain/event-publisher"
import { Participant, ParticipantManifest } from "@space/domain/participant"
import { SituationHandler } from "@space/domain/situation-handler"
import { UuidGenerator } from "@util/uuid-generator"

export class RegisterParticipantUseCase<TParticipant> {
	private readonly spaceRepository: SpaceRepository
	private readonly eventPublisher: EventPublisher

	constructor(spaceRepository: SpaceRepository, eventPublisher: EventPublisher) {
		this.spaceRepository = spaceRepository
		this.eventPublisher = eventPublisher
	}

	async execute(
		name: string,
		capabilities: readonly string[],
		handlers: SituationHandler<TParticipant>[],
		self: TParticipant,
		spaceId: string,
	): Promise<void> {
		const space = await this.spaceRepository.findById(spaceId)
		if (!space) {
			throw new Error("Space not found")
		}

		const manifest: ParticipantManifest = {
			id: UuidGenerator.create(),
			name,
			capabilities,
			role: "external",
		}
		const participant = new Participant(manifest, handlers, self)

		const event = space.addParticipant(participant)
		if (event) {
			this.eventPublisher.publish(event, space.getParticipants())
		}
		await this.spaceRepository.save(space)
	}
}
