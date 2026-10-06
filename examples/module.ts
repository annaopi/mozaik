import { defineAgentModule } from "src/agent-module"
import { LocalToolRunner } from "@application/runners/local-tool-runner"
import { defineRuntime } from "src/define-runtime"

const agentModule = defineAgentModule({
	toolRunner: new LocalToolRunner(),
})

export const { createAgent, createLoop, runLoop } = agentModule

const spaceModule = defineRuntime()

export const { createSpace, join, leave, sendMessage, createParticipant } = spaceModule
