import {
	AwaitingInference,
	AwaitingRequest,
	AwaitingToolOutput,
	LoopSpecification,
	ModelAnswered,
} from "@agent/domain/loop/specification"
import {
	CompleteAction,
	InferenceAction,
	LoopAction,
	RequestPreparationAction,
	ToolUseAction,
} from "@agent/domain/loop/action"
import { InferenceRequest } from "@inference/inference-request"

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

export type RuleBookRecord = {
	readonly rules: LoopRuleRecord[]
}

export class RuleBook {
	private rules: LoopRule[]

	private constructor(rules: LoopRule[]) {
		this.rules = rules
	}

	addRule(rule: LoopRule): void {
		this.rules.push(rule)
	}

	removeRule(rule: LoopRule): void {
		this.rules = this.rules.filter((r) => r.id !== rule.id)
	}

	getRules(): readonly LoopRule[] {
		return this.rules
	}

	static create(loopRuleParams: CreateLoopRuleParams[]): RuleBook {
		const rules = loopRuleParams.map((param) => LoopRule.create(param))
		return new RuleBook(rules)
	}

	static rehydrate(record: RuleBookRecord): RuleBook {
		const rules = record.rules.map((rule) => LoopRule.rehydrate(rule))
		return new RuleBook(rules)
	}

	record(): RuleBookRecord {
		return {
			rules: this.rules.map((rule) => ({
				id: rule.id,
				priority: rule.priority,
				condition: rule.condition,
				action: rule.action,
			})),
		}
	}
}

export const defaultRules: (request: InferenceRequest) => CreateLoopRuleParams[] = (request: InferenceRequest) => [
	{
		when: new AwaitingRequest(),
		then: new RequestPreparationAction(request),
	},
	{
		when: new AwaitingInference(),
		then: new InferenceAction(),
	},
	{
		when: new AwaitingToolOutput(),
		then: new ToolUseAction(),
	},
	{
		when: new ModelAnswered(),
		then: new CompleteAction("completed"),
	},
]
