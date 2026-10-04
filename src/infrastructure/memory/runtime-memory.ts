import { Memory } from "@domain/agent/memory"
import { Context, ContextItem } from "@domain/inference/context"

export class RuntimeMemory implements Memory {
	private readonly context: Context

	constructor(context: Context) {
		this.context = context
	}

	getContext(): Context {
		return this.context
	}

	saveItem(item: ContextItem): void {
		this.context.items.push(item)
	}

	saveItems(items: ContextItem[]): void {
		this.context.items.push(...items)
	}
}
