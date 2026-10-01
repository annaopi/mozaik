import { Memory } from "@agent/memory"
import { Participant, ParticipantManifest } from "src/space/participant"
import { Tool } from "@inference/tool"
import { SituationHandler } from "src/space/situation-handler"
import { AgentRecord } from "@agent/record"
import { SpaceEvent } from "src/space/event"

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
