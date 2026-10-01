import { Context, ContextItem } from "@domain/inference/context"

export interface Memory {
	getContext(): Context
	saveItem(item: ContextItem): void
	saveItems(items: ContextItem[]): void
}

export interface MemoryFactory {
	create(): Memory
}
