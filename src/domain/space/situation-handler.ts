import { SpaceEvent } from "@domain/space/event"
import { Participant } from "@domain/space/participant"
import { SituationSpecification } from "@domain/space/situation-specification"

export interface SituationHandler {
	readonly specification: SituationSpecification
	readonly processor: SituationProcessor
}

export type SituationContext<TEvent extends SpaceEvent = SpaceEvent> = {
	readonly event: TEvent
	readonly participant: Participant
}

export interface SituationProcessor {
	apply(context: SituationContext): void | Promise<void>
}
