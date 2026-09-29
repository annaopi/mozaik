import { Memory } from "@agent/memory"
import { Participant, ParticipantManifest } from "@environment/participant"
import { Tool } from "@inference/tool"
import { SituationHandler } from "@environment/situation-handler"
import { AgentRecord } from "@agent/record"
import { RuleBook } from "@agent/loop/rule-book"

export class Agent extends Participant {
	private memory: Memory
	private tools: Tool[]
	private ruleBook: RuleBook

	constructor(
		manifest: ParticipantManifest,
		tools: Tool[],
		memory: Memory,
		handlers: SituationHandler[],
		ruleBook: RuleBook,
	) {
		super(manifest, handlers)
		this.memory = memory
		this.tools = tools
		this.ruleBook = ruleBook
	}

	getTools(): Tool[] {
		return this.tools
	}

	getMemory(): Memory {
		return this.memory
	}

	getRuleBook(): RuleBook {
		return this.ruleBook
	}

	static create({
		manifest,
		tools,
		memory,
		handlers,
		ruleBook,
	}: {
		manifest: ParticipantManifest
		tools: Tool[]
		memory: Memory
		handlers: SituationHandler[]
		ruleBook: RuleBook
	}): Agent {
		return new Agent(manifest, tools, memory, handlers, ruleBook)
	}

	static rehydrate(record: AgentRecord): Agent {
		const agent = new Agent(record.manifest, record.tools, record.memory, record.handlers, record.ruleBook)
		return agent
	}
}
