import { AgentLoop } from "@agent/domain/loop/specification"
import { LoopControlDirective } from "@agent/domain/loop/directive"
import { InferenceRequest } from "@inference/inference-request"

export abstract class LoopAction {
	abstract execute(agentLoop: AgentLoop): LoopControlDirective
}

export class RequestPreparationAction extends LoopAction {
	constructor(private readonly request: InferenceRequest) {
		super()
	}
	execute(agentLoop: AgentLoop): LoopControlDirective {
		return {
			type: "inference",
			request: this.request,
		}
	}
}

export class InferenceAction extends LoopAction {
	execute(agentLoop: AgentLoop): LoopControlDirective {
		const request = agentLoop.loop.request

		if (!request) {
			return { type: "wait", reason: "no request" }
		}

		return { type: "inference", request }
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
	private reason: string

	constructor(reason: string) {
		super()
		this.reason = reason
	}
	execute(): LoopControlDirective {
		return { type: "wait", reason: this.reason }
	}
}
