import { Loop } from "@domain/agent/loop/loop"

export interface LoopRepository {
	save(loop: Loop): Promise<void>
	findById(id: string): Promise<Loop | undefined>
}
