import { AgentLoop } from "@agent/loop/specification"
import { LoopControlDirective } from "@agent/loop/directive"
import { InferenceRequest } from "@inference/inference-runner"

export abstract class LoopAction {
	abstract execute(agentLoop: AgentLoop): LoopControlDirective
}

export class InferenceAction extends LoopAction {
	private request: InferenceRequest

	constructor(request: InferenceRequest) {
		super()
		this.request = request
	}

	execute(): LoopControlDirective {
		return { type: "inference", request: this.request }
	}
}

export class ToolUseAction extends LoopAction {
	execute(agentLoop: AgentLoop): LoopControlDirective {
		if (!agentLoop.loop.pending) {
			return { type: "wait" } as LoopControlDirective
		}

		const pendingOperation = agentLoop.loop.pending

		if (pendingOperation.type === "tool_execution") {
			return { type: "tool_use", call: pendingOperation.call }
		}

		return { type: "wait" } as LoopControlDirective
	}
}

export class CompleteAction extends LoopAction {
	private reason: string

	constructor(reason: string) {
		super()
		this.reason = reason
	}

	execute(): LoopControlDirective {
		return { type: "complete", reason: this.reason }
	}
}

export class WaitAction extends LoopAction {
	execute(): LoopControlDirective {
		return { type: "wait" }
	}
}
