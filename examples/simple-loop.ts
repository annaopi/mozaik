import "dotenv/config"
import { complete, state, modelAnswered, toolUse, createLoop, createAgent, advanceLoop, runInference } from "./module"
import { Tool } from "@inference/tool"
import { AgentLoop } from "@agent/loop/specification"
import { LoopControlDirective } from "@agent/loop/directive"
import { LoopAction } from "@agent/loop/action"

export const jokeTellerTool: Tool = {
	name: "joke-actors",
	description: "Get joke actors.",
	parameters: {
		type: "object",
		properties: {
			topic: { type: "string" },
		},
	},
	type: "function",
	strict: false,
	invoke: function (args: { topic: string }): string {
		return "Mujo i Haso"
	},
}

export class RequestPreparation extends LoopAction {
	execute(agentLoop: AgentLoop): LoopControlDirective {
		return {
			type: "inference",
			request: {
				tools: agentLoop.agent.getTools(),
				model: "gpt-5.4",
				context: agentLoop.agent.getMemory().getContext(),
			},
		}
	}
}

async function run() {
	const agent = await createAgent({
		name: "joke-teller",
		instruction: "You are a joke teller. Use joke-actors tool to get joke actors.",
		tools: [jokeTellerTool],
		handlers: [],
	})

	agent.memory.getContext().items.push({
		type: "user_message",
		text: "Tell me a joke about the basketball players",
	})

	const loop = await createLoop({
		subject: "Tell me a joke about the basketball players",
		agentId: agent.id,
		rules: [
			{
				when: state("awaiting_inference_request"),
				then: new RequestPreparation(),
			},
			{
				when: state("awaiting_inference"),
				then: runInference(),
			},
			{
				when: state("awaiting_tool_output"),
				then: toolUse(),
			},
			{
				when: modelAnswered(),
				then: complete(),
			},
		],
		executionStrategy: "auto",
	})

	await advanceLoop(loop.id)

	console.log("loop state:", loop.stateId)
	console.log("completed operations:", loop.completedOperations.length)
	console.log("transitions:", loop.history.map((transition) => transition.reason).join(" -> "))

	console.log("context:", agent.memory.getContext().items)
}

run()
