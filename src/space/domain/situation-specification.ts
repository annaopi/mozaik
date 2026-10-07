import { SpaceEvent } from "@util/space-event"
import { Participant } from "@space/domain/participant"

export type SituationContext<TParticipant, TEvent extends SpaceEvent = SpaceEvent> = {
	readonly event: TEvent
	readonly participant: Participant<TParticipant>
}

export abstract class SituationSpecification<TParticipant, TEvent extends SpaceEvent = SpaceEvent> {
	abstract isSatisfiedBy(situationContext: SituationContext<TParticipant, TEvent>): boolean

	and(other: SituationSpecification<TParticipant, TEvent>): SituationSpecification<TParticipant, TEvent> {
		return new AndSituationSpecification<TParticipant, TEvent>(this, other)
	}

	or(other: SituationSpecification<TParticipant, TEvent>): SituationSpecification<TParticipant, TEvent> {
		return new OrSituationSpecification<TParticipant, TEvent>(this, other)
	}

	not(): SituationSpecification<TParticipant, TEvent> {
		return new NotSituationSpecification<TParticipant, TEvent>(this)
	}
}

class AndSituationSpecification<TParticipant, TEvent extends SpaceEvent> extends SituationSpecification<
	TParticipant,
	TEvent
> {
	constructor(
		private readonly left: SituationSpecification<TParticipant, TEvent>,
		private readonly right: SituationSpecification<TParticipant, TEvent>,
	) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TParticipant, TEvent>): boolean {
		return this.left.isSatisfiedBy(situationContext) && this.right.isSatisfiedBy(situationContext)
	}
}

class OrSituationSpecification<TParticipant, TEvent extends SpaceEvent> extends SituationSpecification<
	TParticipant,
	TEvent
> {
	constructor(
		private readonly left: SituationSpecification<TParticipant, TEvent>,
		private readonly right: SituationSpecification<TParticipant, TEvent>,
	) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TParticipant, TEvent>): boolean {
		return this.left.isSatisfiedBy(situationContext) || this.right.isSatisfiedBy(situationContext)
	}
}

class NotSituationSpecification<TParticipant, TEvent extends SpaceEvent> extends SituationSpecification<
	TParticipant,
	TEvent
> {
	constructor(private readonly rule: SituationSpecification<TParticipant, TEvent>) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TParticipant, TEvent>): boolean {
		return !this.rule.isSatisfiedBy(situationContext)
	}
}
