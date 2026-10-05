import "dotenv/config"
import { createLoop, createAgent, runLoop } from "./module"
import { Tool } from "@domain/inference/tool"
import { LoopTransition } from "@domain/agent/loop/transition"

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

async function run() {
	const agent = await createAgent({
		name: "joke-teller",
		instruction: "You are a joke teller. Use joke-actors tool to get joke actors.",
		tools: [jokeTellerTool],
		handlers: [],
	})

	const loop = await createLoop({
		subject: "Tell me a joke about the basketball players",
		agentId: agent.id,
		request: {
			tools: agent.tools,
			model: "gpt-5.4",
			context: {
				items: [
					{
						type: "user_message",
						text: "Tell me a joke about the basketball players",
					},
				],
			},
		},
	})

	await runLoop(loop.id)

	console.log("loop state:", loop.stateId)
	console.log("completed operations:", loop.completedOperations.length)
	console.log("transitions:", loop.history.map((transition: LoopTransition) => transition.reason).join(" -> "))
}

run()
