import { SpaceEvent } from "@domain/space/event"
import { Participant } from "@domain/space/participant"

export type SituationContext<TEvent extends SpaceEvent = SpaceEvent> = {
	readonly event: TEvent
	readonly participant: Participant
}

export abstract class SituationSpecification<TEvent extends SpaceEvent = SpaceEvent> {
	abstract isSatisfiedBy(situationContext: SituationContext<TEvent>): boolean

	and(other: SituationSpecification<TEvent>): SituationSpecification<TEvent> {
		return new AndSituationSpecification(this, other)
	}

	or(other: SituationSpecification<TEvent>): SituationSpecification<TEvent> {
		return new OrSituationSpecification(this, other)
	}

	not(): SituationSpecification<TEvent> {
		return new NotSituationSpecification(this)
	}
}

class AndSituationSpecification<TEvent extends SpaceEvent> extends SituationSpecification<TEvent> {
	constructor(
		private readonly left: SituationSpecification<TEvent>,
		private readonly right: SituationSpecification<TEvent>,
	) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TEvent>): boolean {
		return this.left.isSatisfiedBy(situationContext) && this.right.isSatisfiedBy(situationContext)
	}
}

class OrSituationSpecification<TEvent extends SpaceEvent> extends SituationSpecification<TEvent> {
	constructor(
		private readonly left: SituationSpecification<TEvent>,
		private readonly right: SituationSpecification<TEvent>,
	) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TEvent>): boolean {
		return this.left.isSatisfiedBy(situationContext) || this.right.isSatisfiedBy(situationContext)
	}
}

class NotSituationSpecification<TEvent extends SpaceEvent> extends SituationSpecification<TEvent> {
	constructor(private readonly rule: SituationSpecification<TEvent>) {
		super()
	}

	isSatisfiedBy(situationContext: SituationContext<TEvent>): boolean {
		return !this.rule.isSatisfiedBy(situationContext)
	}
}
