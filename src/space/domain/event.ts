import { ParticipantManifest } from "@space/domain/participant"

export class SpaceEvent<TType extends string = string, TPayload = unknown> {
	readonly type: TType
	readonly producerId: string
	readonly occurredAt: Date
	readonly payload: TPayload

	constructor(type: TType, producerId: string, occurredAt: Date, payload: TPayload) {
		this.type = type
		this.producerId = producerId
		this.occurredAt = occurredAt
		this.payload = payload
	}

	static create<TType extends string = string, TPayload = unknown>(
		type: TType,
		producerId: string,
		occurredAt: Date,
		payload: TPayload,
	): SpaceEvent<TType, TPayload> {
		return new SpaceEvent(type, producerId, occurredAt, payload)
	}
}

export class ParticipantJoinedEvent extends SpaceEvent<"participant.joined", ParticipantManifest> {
	static init(manifest: ParticipantManifest, occurredAt: Date): ParticipantJoinedEvent {
		return SpaceEvent.create("participant.joined", manifest.id, occurredAt, manifest)
	}
}

export class ParticipantLeftEvent extends SpaceEvent<"participant.left", ParticipantManifest> {
	static init(manifest: ParticipantManifest, occurredAt: Date): ParticipantLeftEvent {
		return SpaceEvent.create("participant.left", manifest.id, occurredAt, manifest)
	}
}

export class MessageSentEvent extends SpaceEvent<"message.sent", { message: string }> {
	static init(producerId: string, message: string, occurredAt: Date): MessageSentEvent {
		return SpaceEvent.create("message.sent", producerId, occurredAt, { message })
	}
}

export class ModelAnswerEvent extends SpaceEvent<"model.answer", { answer: string }> {
	static init(producerId: string, answer: string, occurredAt: Date): ModelAnswerEvent {
		return ModelAnswerEvent.create("model.answer", producerId, occurredAt, { answer })
	}
}
