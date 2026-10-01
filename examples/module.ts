import { createAgentModule } from "src/agent-module"
import { LocalToolRunner } from "@application/runners/local-tool-runner"

const agentModule = createAgentModule({
	toolRunner: new LocalToolRunner(),
})

export const { createAgent, createLoop, advanceLoop, state, modelAnswered, runInference, toolUse, complete } =
	agentModule
