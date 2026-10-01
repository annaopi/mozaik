import { Tool } from "@domain/inference/tool"
import { ParticipantManifest } from "@domain/space/participant"
import { Memory } from "@domain/agent/memory"
import { SituationHandler } from "@domain/space/situation-handler"

export type AgentRecord = {
	id: string
	manifest: ParticipantManifest
	tools: Tool[]
	memory: Memory
	handlers: SituationHandler[]
}
