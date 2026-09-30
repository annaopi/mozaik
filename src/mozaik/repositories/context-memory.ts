import { Memory } from "@agent/memory"
import { Context } from "@inference/context"

export class ContextMemory implements Memory {
	private readonly context: Context

	private constructor(context: Context) {
		this.context = context
	}

	getContext(): Context {
		return this.context
	}

	static create(): Memory {
		const context: Context = {
			items: [],
		}
		return new ContextMemory(context)
	}
}
