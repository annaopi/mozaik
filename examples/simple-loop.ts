import "dotenv/config"
import type { InferenceRequest } from "@inference/inference-runner"
import { inference, complete, state, modelAnswered, toolUse, createLoop, createAgent, advanceLoop } from "./module"
import { Tool } from "@inference/tool"

const request: InferenceRequest = {
	model: "gpt-5.4",
	context: {
		items: [
			{
				type: "user_message",
				text: "Tell me a joke about soccer.",
			},
		],
	},
}

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
		return "Blondes"
	},
}

async function run() {
	const agent = await createAgent({
		name: "joke-teller",
		instruction: "You are a joke teller. Use joke-actors tool to get joke actors.",
		tools: [jokeTellerTool],
		handlers: [],
	})

	const loop = await createLoop({
		subject: "Tell me a joke about the topic",
		rules: [
			{
				when: state("idle"),
				then: inference(request),
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
	})

	while (loop.stateId !== "completed") {
		await advanceLoop(agent.id, loop.id)
	}

	console.log("loop state:", loop.stateId)
	console.log("completed operations:", loop.completedOperations.length)
	console.log("transitions:", loop.history.map((transition) => transition.reason).join(" -> "))
}

run()
