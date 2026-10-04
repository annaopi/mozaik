import { LoopSpecification } from "@domain/agent/loop/specification"
import { LoopAction } from "@domain/agent/loop/action"

export type CreateLoopRuleParams = {
	readonly priority?: number
	readonly when: LoopSpecification
	readonly then: LoopAction
}

export type LoopRuleRecord = {
	readonly id: string
	readonly priority: number
	readonly condition: LoopSpecification
	readonly action: LoopAction
}

export class LoopRule {
	_id: string
	_priority: number
	_condition: LoopSpecification
	_action: LoopAction

	constructor(id: string, condition: LoopSpecification, action: LoopAction, priority: number) {
		this._id = id
		this._priority = priority
		this._condition = condition
		this._action = action
	}

	get id(): string {
		return this._id
	}

	get priority(): number {
		return this._priority
	}

	get condition(): LoopSpecification {
		return this._condition
	}

	get action(): LoopAction {
		return this._action
	}

	static create(spec: CreateLoopRuleParams): LoopRule {
		const priority = spec.priority ?? 0
		const id = crypto.randomUUID()
		return new LoopRule(id, spec.when, spec.then, priority)
	}

	static rehydrate(spec: LoopRuleRecord): LoopRule {
		const priority = spec.priority ?? 0
		const rule = new LoopRule(spec.id, spec.condition, spec.action, priority)
		return rule
	}
}
