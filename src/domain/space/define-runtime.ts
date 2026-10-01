import { RuntimeService } from "@domain/space/runtime"
import { SituationHandler } from "@domain/space/situation-handler"
import { CreateParticipantUseCase } from "@application/use-cases/create-participant"
import { SharedState } from "./shared-state"
import { UuidGenerator } from "@util/uuid-generator"
import { ParticipantJoinedUseCase } from "@application/use-cases/participant-joined"
import { InMemorySpaceRepository } from "@infrastructure/repositories/in-memory-space-repository"
import { EventPublisher } from "./event-publisher"
import { ParticipantLefUseCase } from "@application/use-cases/participant-left"
import { SendMessageUseCase } from "@application/use-cases/send-message"

export function defineRuntime<TSharedState extends SharedState>() {
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

	const createParticipantUseCase = new CreateParticipantUseCase(new UuidGenerator())

	const createParticipant = async (name: string, capabilities: readonly string[], handlers: SituationHandler[]) => {
		return await createParticipantUseCase.execute(name, capabilities, handlers)
	}

	const spaceRepository = new InMemorySpaceRepository()
	const eventPublisher = new EventPublisher()
	const participantJoinedUseCase = new ParticipantJoinedUseCase(spaceRepository, eventPublisher)
	const join = async (spaceId: string, participantId: string) => {
		return await participantJoinedUseCase.execute(spaceId, participantId, new Date())
	}

	const participantLeftUseCase = new ParticipantLefUseCase(spaceRepository, eventPublisher)
	const leave = async (spaceId: string, participantId: string) => {
		return await participantLeftUseCase.execute(spaceId, participantId, new Date())
	}

	const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
	const sendMessage = async (spaceId: string, participantId: string, message: string) => {
		return await sendMessageUseCase.execute(spaceId, participantId, message)
	}

	return {
		initializeRuntime,
		resolveRuntime,
		createParticipant,
		join,
		leave,
		sendMessage,
	}
}
