import { ContextItem } from "@inference/context"

export interface Memory {
	remember(items: ContextItem[], participantId: string): void
	recall(topic: string, participantId: string): ContextItem[]
}

export interface MemoryFactory {
	create(): Memory
}
