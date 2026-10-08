import { RuntimeService } from "@space/domain/runtime"
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

export function defineSpaceModule<TSharedState extends SharedState>() {
	let runtime: RuntimeService<TSharedState> | null = null

	function initializeRuntime(config: { state: TSharedState }): RuntimeService<TSharedState> {
		if (runtime) {
			throw new Error("Runtime already initialized")
		}

		runtime = new RuntimeService(config.state)

		return runtime
	}

	function resolveRuntime(): RuntimeService<TSharedState> {
		if (!runtime) {
			throw new Error("Runtime not initialized")
		}

		return runtime
	}

	const spaceRepository = new InMemorySpaceRepository()
	const eventPublisher = new EventPublisher()

	const createSpaceUseCase = new CreateSpaceUseCase(spaceRepository)
	const createSpace = async (name: string) => {
		return await createSpaceUseCase.execute(name)
	}

	const participantJoinUseCase = new ParticipantJoinUseCase(spaceRepository, eventPublisher)
	const join = async <TParticipant>(
		name: string,
		capabilities: readonly string[],
		handlers: SituationHandler<TParticipant>[],
		self: TParticipant,
		spaceId: string,
	) => {
		return await participantJoinUseCase.execute(name, capabilities, handlers, self, spaceId)
	}

	const participantLeaveUseCase = new ParticipantLeaveUseCase(spaceRepository, eventPublisher)
	const leave = async (spaceId: string, participantId: string) => {
		return await participantLeaveUseCase.execute(spaceId, participantId)
	}

	const sendEventUseCase = new SendEventUseCase(spaceRepository, eventPublisher)
	const sendEvent = async (spaceId: string, participantId: string, event: SpaceEvent) => {
		return await sendEventUseCase.execute(spaceId, participantId, event)
	}

	const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
	const sendMessage = async (spaceId: string, participantId: string, message: string) => {
		return await sendMessageUseCase.execute(spaceId, participantId, message)
	}

	return {
		initializeRuntime,
		resolveRuntime,
		createSpace,
		join,
		leave,
		sendEvent,
		sendMessage,
	}
}
