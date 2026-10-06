import { SpaceEvent } from "@domain/space/event"
import { Participant } from "@domain/space/participant"
import { SituationSpecification } from "@domain/space/situation-specification"

export interface SituationHandler<TParticipant> {
	readonly specification: SituationSpecification<TParticipant>
	readonly processor: SituationProcessor<TParticipant>
}

export type SituationContext<TParticipant, TEvent extends SpaceEvent = SpaceEvent> = {
	readonly event: TEvent
	readonly participant: Participant<TParticipant>
}

export interface SituationProcessor<TParticipant> {
	apply(context: SituationContext<TParticipant>): void | Promise<void>
}
