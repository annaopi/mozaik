import { Tool } from "@inference/tool"
import { ParticipantManifest } from "src/space/participant"
import { Memory } from "./memory"
import { SituationHandler } from "src/space/situation-handler"

export type AgentRecord = {
	id: string
	manifest: ParticipantManifest
	tools: Tool[]
	memory: Memory
	handlers: SituationHandler[]
}
