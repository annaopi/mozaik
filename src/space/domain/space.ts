import { MessageSentEvent, ParticipantJoinedEvent, ParticipantLeftEvent, SpaceEvent } from "@space/domain/event"
import { Participant } from "@space/domain/participant"
import { SystemClock } from "@util/system-clock"
import { UuidGenerator } from "@util/uuid-generator"

export type SpaceRecord = {
	id: string
	name: string
	participants: Participant<unknown>[]
}

export class Space {
	private readonly id: string
	private name: string
	private participants: Participant<unknown>[]
	private events: SpaceEvent[]

	constructor(id: string, name: string, participants: Participant<any>[], events: SpaceEvent[] = []) {
		this.id = id
		this.name = name
		this.participants = participants
		this.events = events
	}

	getId(): string {
		return this.id
	}

	getName(): string {
		return this.name
	}

	addParticipant(participant: Participant<unknown>): SpaceEvent | undefined {
		const alreadyExists = this.participants.find((p) => p.getId() === participant.getId())

		if (alreadyExists) return

		this.participants.push(participant)

		const occurredAt = SystemClock.now()
		return ParticipantJoinedEvent.init(participant.getManifest(), occurredAt)
	}

	getParticipant(id: string): Participant<unknown> | undefined {
		const participant = this.getParticipants().find((p) => p.getId() === id)
		return participant
	}

	removeParticipant(participant: Participant<unknown>): SpaceEvent {
		this.participants = this.participants.filter((p) => p.getId() !== participant.getId())

		const occurredAt = SystemClock.now()
		return ParticipantLeftEvent.init(participant.getManifest(), occurredAt)
	}

	getParticipants(): Participant<unknown>[] {
		return [...this.participants]
	}

	sendMessage(participant: Participant<unknown>, message: string, occurredAt: Date): SpaceEvent {
		const event = MessageSentEvent.init(participant.getId(), message, occurredAt)
		this.events.push(event)
		return event
	}

	getEvents(): SpaceEvent[] {
		return [...this.events]
	}

	static create(name: string, participants: Participant<unknown>[] = []): Space {
		const id = UuidGenerator.create()
		return new Space(id, name, participants)
	}

	get record(): SpaceRecord {
		return {
			id: this.id,
			name: this.name,
			participants: this.participants,
		}
	}

	static rehydrate({ id, name, participants }: SpaceRecord): Space {
		return new Space(id, name, participants)
	}
}
