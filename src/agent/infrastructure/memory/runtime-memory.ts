import { Memory } from "@agent/domain/memory"
import { Context, ContextItem } from "@inference/context"

export class RuntimeMemory implements Memory {
	private readonly context: Context

	constructor(context: Context) {
		this.context = context
	}
	remember(items: ContextItem[], participantId: string): void {
		throw new Error("Method not implemented.")
	}
	recall(topic: string, participantId: string): ContextItem[] {
		throw new Error("Method not implemented.")
	}
}
