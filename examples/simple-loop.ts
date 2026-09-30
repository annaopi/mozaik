import "dotenv/config"
import type { InferenceRequest } from "@inference/inference-runner"
import { inference, complete, state, modelAnswered, toolUse, createLoop, createAgent, advanceLoop } from "./module"
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
				priority: 1,
				when: state("idle").and(modelAnswered()),
				then: complete("The joke was told."),
			},
			{
				when: state("idle"),
				then: inference(request),
			},
			{
				when: state("awaiting_tool_output"),
				then: toolUse(),
			},
		],
	})

	const loop = await createLoop({
		subject: "Tell me a joke about the topic",
	})

	const result = await advanceLoop(agent.id, loop.id)
	console.log("loop state:", result.loop.stateId)
	console.log("completed operations:", result.loop.completedOperations.length)
	console.log("transitions:", result.loop.history.map((transition) => transition.reason).join(" -> "))
}

run()
