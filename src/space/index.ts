import { SpaceEvent } from "@space/domain/event"
import { Participant } from "@space/domain/participant"
import { SharedState } from "@space/domain/shared-state"
import { defineSpaceModule } from "@space/space-module"
import { SituationContext, SituationHandler, SituationProcessor } from "@space/domain/situation-handler"
import { SituationSpecification } from "@space/domain/situation-specification"

export {
	defineSpaceModule,
	SharedState,
	SpaceEvent,
	Participant,
	SituationHandler,
	SituationProcessor,
	SituationSpecification,
	SituationContext,
}
