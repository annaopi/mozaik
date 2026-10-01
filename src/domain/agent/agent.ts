import { Memory } from "@domain/agent/memory"
import { Participant, ParticipantManifest } from "@domain/space/participant"
import { Tool } from "@domain/inference/tool"
import { SituationHandler } from "@domain/space/situation-handler"
import { AgentRecord } from "@domain/agent/record"
import { SpaceEvent } from "@domain/space/event"

export class Agent extends Participant {
	private memory: Memory
	private tools: Tool[]

	constructor(manifest: ParticipantManifest, tools: Tool[], memory: Memory, handlers: SituationHandler[]) {
		super(manifest, handlers)
		this.memory = memory
		this.tools = tools
	}

	getTools(): Tool[] {
		return this.tools
	}

	getMemory(): Memory {
		return this.memory
	}

	static create({
		manifest,
		tools,
		memory,
		handlers,
	}: {
		manifest: ParticipantManifest
		tools: Tool[]
		memory: Memory
		handlers: SituationHandler[]
	}): Agent {
		return new Agent(manifest, tools, memory, handlers)
	}

	static rehydrate(record: AgentRecord): Agent {
		return new Agent(record.manifest, record.tools, record.memory, record.handlers)
	}
}
