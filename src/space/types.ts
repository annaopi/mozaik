import { SharedState } from "@space/domain/shared-state"
import { SpaceRepository } from "@space/domain/space-repository"
import { EventPublisher } from "@space/domain/event-publisher"

type SpaceModule<TSharedState extends SharedState> = {
	spaceRepository: SpaceRepository
	eventPublisher: EventPublisher
	state: TSharedState
}

type SpaceModuleConfig<TSharedState extends SharedState = SharedState> = {
	spaceRepository?: SpaceRepository
	eventPublisher?: EventPublisher
	state?: TSharedState
}

export type { SpaceModule, SpaceModuleConfig }
