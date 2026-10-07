import { Agent } from "@agent/domain/agent"
import { LoopControlDirective } from "@agent/domain/loop/directive"
import { InferenceRunner } from "@inference/inference-runner"
import { DirectiveExecutionStrategy } from "@agent/application/directive-execution/directive-execution-strategy"
import { Loop } from "@agent/domain/loop/loop"

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
