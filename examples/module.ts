import { defineAgentModule } from "src/agent-module"
import { LocalToolRunner } from "@application/runners/local-tool-runner"

const agentModule = defineAgentModule({
	toolRunner: new LocalToolRunner(),
})

export const { createAgent, createLoop, runLoop } = agentModule
