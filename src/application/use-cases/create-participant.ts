import { Participant, ParticipantManifest } from "@domain/space/participant"
import { SituationHandler } from "@domain/space/situation-handler"
import { UuidGenerator } from "@util/uuid-generator"

export class CreateParticipantUseCase {
	async execute(name: string, capabilities: readonly string[], handlers: SituationHandler[]): Promise<Participant> {
		const manifest: ParticipantManifest = {
			id: UuidGenerator.create(),
			name,
			capabilities,
			role: "external",
		}
		const participant = new Participant(manifest, handlers)
		return participant
	}
}
