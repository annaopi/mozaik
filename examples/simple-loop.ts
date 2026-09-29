import "dotenv/config"
import type { InferenceRequest } from "@inference/inference-runner"
import { inference, complete, state, createLoop, advanceLoop, createAgent } from "./module"
import { ToolUseAction } from "@agent/loop/action"
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

async function run() {
	const agent = await createAgent({
		name: "joke-teller",
		instruction: "You are a joke teller. You are given a topic and you need to tell a joke about it.",
		tools: [],
		handlers: [],
		ruleBook: [
			{
				when: state("idle"),
				then: inference(request),
			},
			{
				when: state("awaiting_tool_output"),
				then: new ToolUseAction(),
			},
			{
				when: state("completed"),
				then: complete("The joke was told."),
			},
		],
	})

	const loop = await createLoop({
		subject: "Tell me a joke about the topic",
	})

	await advanceLoop(agent.id, loop.id)
	console.log("loop state:", loop.stateId)
	console.log("completed operations:", loop.completedOperations.length)
}

run()
