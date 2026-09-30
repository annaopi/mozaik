import { RuntimeEvent } from "./event"
import { Participant } from "./participant"

export class EventPublisher {
	publish(event: RuntimeEvent, participants: Participant[]): void {
		for (const participant of participants) {
			participant.getHandlers().forEach((handler) => {
				if (handler.specification.isSatisfiedBy({ event, participant })) {
					handler.processor.apply({ event, participant })
				}
			})
		}
	}
}
