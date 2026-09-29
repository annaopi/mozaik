import { Tool } from "@inference/tool"
import { ParticipantManifest } from "@environment/participant"
import { Memory } from "./memory"
import { SituationHandler } from "@environment/situation-handler"
import { RuleBook } from "./loop/rule-book"

export type AgentRecord = {
	id: string
	manifest: ParticipantManifest
	tools: Tool[]
	memory: Memory
	handlers: SituationHandler[]
	ruleBook: RuleBook
}
