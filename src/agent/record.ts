import { Tool } from "@inference/tool"
import { ParticipantManifest } from "@environment/participant"
import { Memory } from "./memory"
import { SituationHandler } from "@environment/situation-handler"

export type AgentRecord = {
	id: string
	manifest: ParticipantManifest
	tools: Tool[]
	memory: Memory
	handlers: SituationHandler[]
}
