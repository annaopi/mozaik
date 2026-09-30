import { createAgentModule } from "@agent/agent-module"
import { LocalToolRunner } from "src/mozaik/runners/local-tool-runner"

const agentModule = createAgentModule({
	toolRunner: new LocalToolRunner(),
})

export const { createAgent, createLoop, advanceLoop, state, modelAnswered, inference, toolUse, complete } = agentModule
