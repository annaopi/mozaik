import { Agent } from "@domain/agent/agent"
import { LoopControlDirective } from "@domain/agent/loop/directive"
import { InferenceRunner } from "@domain/inference/inference-runner"
import { DirectiveExecutionStrategy } from "./directive-execution-strategy"
import { Loop } from "@domain/agent/loop/loop"

export class InferenceExecutionStrategy implements DirectiveExecutionStrategy {
	constructor(private readonly inferenceRunner: InferenceRunner) {}

	async execute(directive: LoopControlDirective, agent: Agent, loop: Loop) {
		if (directive.type !== "inference") {
			throw new Error("Expected an inference directive")
		}

		const pending = loop.requestInference(directive.request)
		const result = await this.inferenceRunner.run(directive.request)

		loop.receiveInferenceResult(pending.id, result)
	}
}
