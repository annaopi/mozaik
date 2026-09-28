import { Loop } from "@agent/loop"
import { LoopRule } from "@agent/loop/rule"
import { LoopControlDirective } from "@agent/loop/directive"

export class LoopController {
	_rules: LoopRule[]

	constructor(loopRules: LoopRule[]) {
		this._rules = loopRules
	}

	get rules(): LoopRule[] {
		return this._rules
	}

	set rules(rules: LoopRule[]) {
		this._rules = rules
	}

	addRule(rule: LoopRule): void {
		this._rules.push(rule)
	}

	removeRule(rule: LoopRule): void {
		this._rules = this._rules.filter((r) => r !== rule)
	}
}

export class LoopRuleEngine {
	decide(loop: Loop): LoopControlDirective | undefined {
		const satisfiedRules = loop.getController().rules.filter((rule) => rule.condition.isSatisfiedBy(loop))
		if (satisfiedRules.length === 0) {
			return undefined
		}

		const highestPriorityRule = satisfiedRules.reduce((highest, current) => {
			return highest.priority > current.priority ? highest : current
		})

		return highestPriorityRule.action.execute(loop)
	}
}
