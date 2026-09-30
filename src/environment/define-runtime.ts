import { RuntimeService } from "@environment/runtime"
import { SituationHandler } from "@environment/situation-handler"
import { CreateParticipantUseCase } from "src/mozaik/use-cases/create-participant"
import { SharedState } from "./shared-state"
import { UuidGenerator } from "@util/uuid-generator"
import { ParticipantJoinedEnvironmentUseCase } from "src/mozaik/use-cases/participant-joined-environment"
import { InMemoryEnvironmentRepository } from "src/mozaik/repositories/in-memory-environment-repository"
import { EventPublisher } from "./event-publisher"
import { ParticipantLeftEnvironmentUseCase } from "src/mozaik/use-cases/participant-left-environment"
import { SendMessageUseCase } from "src/mozaik/use-cases/send-message"

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

	const environmentRepository = new InMemoryEnvironmentRepository()
	const eventPublisher = new EventPublisher()
	const participantJoinedEnvironmentUseCase = new ParticipantJoinedEnvironmentUseCase(
		environmentRepository,
		eventPublisher,
	)
	const join = async (environmentId: string, participantId: string) => {
		return await participantJoinedEnvironmentUseCase.execute(environmentId, participantId, new Date())
	}

	const participantLeftEnvironmentUseCase = new ParticipantLeftEnvironmentUseCase(
		environmentRepository,
		eventPublisher,
	)
	const leave = async (environmentId: string, participantId: string) => {
		return await participantLeftEnvironmentUseCase.execute(environmentId, participantId, new Date())
	}

	const sendMessageUseCase = new SendMessageUseCase(environmentRepository, eventPublisher)
	const sendMessage = async (environmentId: string, participantId: string, message: string) => {
		return await sendMessageUseCase.execute(environmentId, participantId, message)
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
