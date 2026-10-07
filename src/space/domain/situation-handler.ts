import { SpaceEvent } from "@util/space-event"
import { Participant } from "@space/domain/participant"
import { SituationSpecification } from "@space/domain/situation-specification"

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
