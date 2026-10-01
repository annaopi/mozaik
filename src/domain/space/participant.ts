import { SituationHandler } from "@domain/space/situation-handler"

export type ParticipantRole = "agent" | "external"

export type ParticipantManifest = {
	readonly id: string
	readonly name: string
	readonly role: ParticipantRole
	readonly capabilities?: readonly string[]
}

export class Participant {
	private manifest: ParticipantManifest
	private handlers: SituationHandler[]

	constructor(manifest: ParticipantManifest, handlers: SituationHandler[]) {
		this.manifest = manifest
		this.handlers = handlers
	}

	getManifest(): ParticipantManifest {
		return this.manifest
	}

	setManifest(manifest: ParticipantManifest): void {
		this.manifest = manifest
	}

	getId(): string {
		return this.manifest.id
	}

	getHandlers(): SituationHandler[] {
		return this.handlers
	}

	setHandlers(handlers: SituationHandler[]): void {
		this.handlers = handlers
	}
}
