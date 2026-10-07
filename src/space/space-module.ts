import { RuntimeService } from "@space/domain/runtime"
import { SituationHandler } from "@space/domain/situation-handler"
import { SharedState } from "@space/domain/shared-state"
import { RegisterParticipantUseCase } from "@space/application/register-participant"
import { InMemorySpaceRepository } from "@space/infrastructure/in-memory-space-repository"
import { EventPublisher } from "@space/domain/event-publisher"
import { RemoveParticipantUseCase } from "@space/application/remove-participant"
import { SendMessageUseCase } from "@space/application/send-message"
import { CreateSpaceUseCase } from "@space/application/create-space"

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

	const registerParticipantUseCase = new RegisterParticipantUseCase(spaceRepository, eventPublisher)
	const registerParticipant = async <TParticipant>(
		name: string,
		capabilities: readonly string[],
		handlers: SituationHandler<TParticipant>[],
		self: TParticipant,
		spaceId: string,
	) => {
		return await registerParticipantUseCase.execute(name, capabilities, handlers, self, spaceId)
	}

	const removeParticipantUseCase = new RemoveParticipantUseCase(spaceRepository, eventPublisher)
	const removeParticipant = async (spaceId: string, participantId: string) => {
		return await removeParticipantUseCase.execute(spaceId, participantId)
	}

	const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
	const sendMessage = async (spaceId: string, participantId: string, message: string) => {
		return await sendMessageUseCase.execute(spaceId, participantId, message)
	}

	return {
		initializeRuntime,
		resolveRuntime,
		createSpace,
		registerParticipant,
		removeParticipant,
		sendMessage,
	}
}
