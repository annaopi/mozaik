import { SituationHandler } from "@space/domain/situation-handler"
import { SharedState } from "@space/domain/shared-state"
import { ParticipantJoinUseCase } from "@space/application/paricipant-join"
import { InMemorySpaceRepository } from "@space/infrastructure/in-memory-space-repository"
import { EventPublisher } from "@space/domain/event-publisher"
import { ParticipantLeaveUseCase } from "@space/application/participant-leave"
import { SendMessageUseCase } from "@space/application/send-message"
import { CreateSpaceUseCase } from "@space/application/create-space"
import { SendEventUseCase } from "./application/send-event"
import { SpaceEvent } from "@util/space-event"
import { GetParticipantsUseCase } from "./application/get-participants"
import { SpaceRepository } from "./domain/space-repository"

type SpaceModule<TSharedState extends SharedState> = {
	spaceRepository: SpaceRepository
	eventPublisher: EventPublisher
	state: TSharedState
}

let module: SpaceModule<SharedState> | undefined

export type SpaceModuleConfig<TSharedState extends SharedState = SharedState> = {
	spaceRepository?: SpaceRepository
	eventPublisher?: EventPublisher
	state?: TSharedState
}

function initializeSpaceModule(config: SpaceModuleConfig<SharedState> = {}) {
	if (module) {
		throw new Error("Space module already registered")
	}

	const spaceRepository = config.spaceRepository ?? new InMemorySpaceRepository()
	const eventPublisher = config.eventPublisher ?? new EventPublisher()

	module = {
		spaceRepository,
		eventPublisher,
		state: config.state ?? {},
	}
}

export function resolveSpaceModule(): SpaceModule<SharedState> {
	if (!module) {
		throw new Error("Space module not registered")
	}

	return module
}

const createSpace = async (name: string) => {
	const { spaceRepository } = resolveSpaceModule()
	const createSpaceUseCase = new CreateSpaceUseCase(spaceRepository)
	return await createSpaceUseCase.execute(name)
}

const join = async <TParticipant>(
	name: string,
	capabilities: readonly string[],
	handlers: SituationHandler<TParticipant>[],
	self: TParticipant,
	spaceId: string,
) => {
	const { spaceRepository, eventPublisher } = resolveSpaceModule()
	const participantJoinUseCase = new ParticipantJoinUseCase(spaceRepository, eventPublisher)
	return await participantJoinUseCase.execute(name, capabilities, handlers, self, spaceId)
}

const leave = async (spaceId: string, participantId: string) => {
	const { spaceRepository, eventPublisher } = resolveSpaceModule()
	const participantLeaveUseCase = new ParticipantLeaveUseCase(spaceRepository, eventPublisher)
	return await participantLeaveUseCase.execute(spaceId, participantId)
}
const getParticipants = async (spaceId: string) => {
	const { spaceRepository } = resolveSpaceModule()
	const getParticipantsUseCase = new GetParticipantsUseCase(spaceRepository)
	return await getParticipantsUseCase.execute(spaceId)
}

const sendEvent = async (spaceId: string, participantId: string, event: SpaceEvent) => {
	const { spaceRepository, eventPublisher } = resolveSpaceModule()
	const sendEventUseCase = new SendEventUseCase(spaceRepository, eventPublisher)
	return await sendEventUseCase.execute(spaceId, participantId, event)
}

const sendMessage = async (spaceId: string, participantId: string, message: string) => {
	const { spaceRepository, eventPublisher } = resolveSpaceModule()
	const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
	return await sendMessageUseCase.execute(spaceId, participantId, message)
}

export { createSpace, join, leave, getParticipants, sendEvent, sendMessage, initializeSpaceModule }
