import { MessageSentEvent, ParticipantJoinedEvent, ParticipantLeftEvent, RuntimeEvent } from "@environment/event"
import { Participant } from "@environment/participant"

export type EnvironmentRecord = {
	id: string
	name: string
	ownerId: string
	participants: Participant[]
}

export class Environment {
	private readonly id: string
	private readonly ownerId: string
	private name: string
	private participants: Participant[]
	private events: RuntimeEvent[]

	constructor(id: string, name: string, ownerId: string, participants: Participant[], events: RuntimeEvent[] = []) {
		this.id = id
		this.ownerId = ownerId
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

	getOwnerId(): string {
		return this.ownerId
	}

	addParticipant(participant: Participant, occurredAt: Date): RuntimeEvent | undefined {
		const alreadyExists = this.participants.find((p) => p.getId() === participant.getId())

		if (alreadyExists) return

		this.participants.push(participant)

		return ParticipantJoinedEvent.init(participant.getManifest(), occurredAt)
	}

	getParticipant(id: string): Participant | undefined {
		const participant = this.getParticipants().find((p) => p.getId() === id)
		if (!participant) {
			throw new Error(`Participant ${id} not found`)
		}

		return participant
	}

	removeParticipant(participant: Participant, occurredAt: Date): RuntimeEvent {
		this.participants = this.participants.filter((p) => p.getId() !== participant.getId())

		return ParticipantLeftEvent.init(participant.getManifest(), occurredAt)
	}

	getParticipants(): Participant[] {
		return [...this.participants]
	}

	sendMessage(participant: Participant, message: string, occurredAt: Date): RuntimeEvent {
		const event = MessageSentEvent.init(participant.getId(), message, occurredAt)
		this.events.push(event)
		return event
	}

	getEvents(): RuntimeEvent[] {
		return [...this.events]
	}

	static create(id: string, name: string, ownerId: string, participants: Participant[] = []): Environment {
		return new Environment(id, name, ownerId, participants)
	}

	get record(): EnvironmentRecord {
		return {
			id: this.id,
			name: this.name,
			ownerId: this.ownerId,
			participants: this.participants,
		}
	}

	static rehydrate({ id, name, ownerId, participants }: EnvironmentRecord): Environment {
		return new Environment(id, name, ownerId, participants)
	}
}
