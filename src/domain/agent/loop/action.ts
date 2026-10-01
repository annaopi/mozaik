import { AgentLoop } from "@domain/agent/loop/specification"
import { LoopControlDirective } from "@domain/agent/loop/directive"

export abstract class LoopAction {
	abstract execute(agentLoop: AgentLoop): LoopControlDirective
}

export class InferenceAction extends LoopAction {
	execute(agentLoop: AgentLoop): LoopControlDirective {
		const request = agentLoop.loop.request

		if (!request) {
			return { type: "wait" }
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
	execute(): LoopControlDirective {
		return { type: "wait" }
	}
}
