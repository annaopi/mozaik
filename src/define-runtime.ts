import { RuntimeService } from "@domain/space/runtime"
import { SituationHandler } from "@domain/space/situation-handler"
import { CreateParticipantUseCase } from "@application/use-cases/create-participant"
import { SharedState } from "@domain/space/shared-state"
import { ParticipantJoinedUseCase } from "@application/use-cases/participant-joined"
import { InMemorySpaceRepository } from "@infrastructure/repositories/in-memory-space-repository"
import { EventPublisher } from "@domain/space/event-publisher"
import { ParticipantLefUseCase } from "@application/use-cases/participant-left"
import { SendMessageUseCase } from "@application/use-cases/send-message"
import { Tool } from "@domain/inference/tool"
import { CreateSpaceUseCase } from "@application/use-cases/create-space"

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

	const createParticipantUseCase = new CreateParticipantUseCase()

	const createParticipant = async (name: string, capabilities: readonly string[], handlers: SituationHandler[]) => {
		return await createParticipantUseCase.execute(name, capabilities, handlers)
	}

	const spaceRepository = new InMemorySpaceRepository()
	const eventPublisher = new EventPublisher()

	const createSpaceUseCase = new CreateSpaceUseCase(spaceRepository)
	const createSpace = async (name: string) => {
		return await createSpaceUseCase.execute(name)
	}

	const participantJoinedUseCase = new ParticipantJoinedUseCase(spaceRepository, eventPublisher)
	const join = async (spaceId: string, participantId: string) => {
		return await participantJoinedUseCase.execute(spaceId, participantId)
	}

	const participantLeftUseCase = new ParticipantLefUseCase(spaceRepository, eventPublisher)
	const leave = async (spaceId: string, participantId: string) => {
		return await participantLeftUseCase.execute(spaceId, participantId)
	}

	const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
	const sendMessage = async (spaceId: string, participantId: string, message: string) => {
		return await sendMessageUseCase.execute(spaceId, participantId, message)
	}

	const sendMessageTool: Tool = {
		type: "function",
		name: "send_message",
		description: "Send a message to the space. The message will be sent to all participants in the space.",
		parameters: {
			spaceId: { type: "string" },
			senderId: { type: "string" },
			message: { type: "string" },
		},
		strict: true,
		invoke: async (args: { spaceId: string; senderId: string; message: string }) => {
			const sendMessageUseCase = new SendMessageUseCase(spaceRepository, eventPublisher)
			await sendMessageUseCase.execute(args.spaceId, args.senderId, args.message)
			return {
				success: true,
				message: "Message sent successfully",
			}
		},
	}

	return {
		initializeRuntime,
		resolveRuntime,
		createParticipant,
		createSpace,
		join,
		leave,
		sendMessage,
		sendMessageTool,
	}
}
