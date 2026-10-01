import { SpaceEvent } from "src/space/event"
import { Participant } from "src/space/participant"
import { SituationSpecification } from "src/space/situation-specification"

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
