import { SpaceEvent } from "@util/space-event"
import { Participant } from "@space/domain/participant"

export class EventPublisher {
	publish(event: SpaceEvent, participants: Participant<any>[]): void {
		for (const participant of participants) {
			participant.getHandlers().forEach((handler) => {
				if (handler.specification.isSatisfiedBy({ event, participant })) {
					handler.processor.apply({ event, participant })
				}
			})
		}
	}
}
