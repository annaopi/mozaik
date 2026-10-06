import { SituationHandler } from "@domain/space/situation-handler"

export type ParticipantRole = "agent" | "external"

export type ParticipantManifest = {
	readonly id: string
	readonly name: string
	readonly role: ParticipantRole
	readonly capabilities?: readonly string[]
}

export class Participant<TParticipant> {
	private manifest: ParticipantManifest
	private handlers: SituationHandler<TParticipant>[]
	private _self: TParticipant

	constructor(manifest: ParticipantManifest, handlers: SituationHandler<TParticipant>[], self: TParticipant) {
		this.manifest = manifest
		this.handlers = handlers
		this._self = self
	}
	get self(): TParticipant {
		return this._self
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

	getHandlers(): SituationHandler<TParticipant>[] {
		return this.handlers
	}

	setHandlers(handlers: SituationHandler<TParticipant>[]): void {
		this.handlers = handlers
	}
}
