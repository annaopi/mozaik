import { defineAgentModule } from "src/agent/agent-module"
import { LocalToolRunner } from "src/agent/application/runners/local-tool-runner"
import { defineSpaceModule } from "@space/space-module"

const agentModule = defineAgentModule({
	toolRunner: new LocalToolRunner(),
})

export const { createAgent, createLoop, runLoop } = agentModule

const spaceModule = defineSpaceModule()

export const { createSpace, registerParticipant, removeParticipant, sendMessage } = spaceModule
