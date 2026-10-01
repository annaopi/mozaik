import { Memory, MemoryFactory } from "@domain/agent/memory"
import { RuntimeMemory } from "./runtime-memory"
import { Context } from "@domain/inference/context"

export class RuntimeMemoryFactory implements MemoryFactory {
	create(): Memory {
		const context: Context = {
			items: [],
		}
		return new RuntimeMemory(context)
	}
}
