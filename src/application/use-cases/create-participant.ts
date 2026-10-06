import { Participant, ParticipantManifest } from "@domain/space/participant"
import { SituationHandler } from "@domain/space/situation-handler"
import { UuidGenerator } from "@util/uuid-generator"

export class CreateParticipantUseCase<TParticipant> {
	async execute(
		name: string,
		capabilities: readonly string[],
		handlers: SituationHandler<TParticipant>[],
		self: TParticipant,
	): Promise<Participant<unknown>> {
		const manifest: ParticipantManifest = {
			id: UuidGenerator.create(),
			name,
			capabilities,
			role: "external",
		}
		const participant = new Participant(manifest, handlers, self)
		return participant
	}
}
