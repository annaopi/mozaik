import { ParticipantManifest } from "@space/domain/participant"
import { SpaceEvent } from "@util/space-event"

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
