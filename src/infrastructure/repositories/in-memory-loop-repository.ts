import { Loop } from "@domain/agent/loop/loop"
import { LoopRepository } from "@domain/agent/loop/repository"

export class InMemoryLoopRepository implements LoopRepository {
	private loops: Loop[] = []

	getById(id: string): Promise<Loop | undefined> {
		return Promise.resolve(this.loops.find((loop) => loop.id === id))
	}
	save(loop: Loop): Promise<void> {
		const index = this.loops.findIndex((stored) => stored.id === loop.id)
		if (index === -1) {
			this.loops.push(loop)
		} else {
			this.loops[index] = loop
		}
		return Promise.resolve()
	}
}
