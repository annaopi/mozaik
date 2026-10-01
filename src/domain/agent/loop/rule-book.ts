import { Loop } from "@domain/agent/loop/loop"
import { CreateLoopRuleParams, LoopRule } from "@domain/agent/loop/rule"
import { LoopControlDirective } from "@domain/agent/loop/directive"
import { AgentLoop } from "./specification"
import { Agent } from "@domain/agent/agent"

export class RuleBook {
	private _rules: LoopRule[]

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

	static create(rules: CreateLoopRuleParams[]): RuleBook {
		return new RuleBook(rules.map((rule) => LoopRule.create(rule)))
	}
}

export class RuleEngine {
	decide(agent: Agent, loop: Loop): LoopControlDirective | undefined {
		const agentLoop: AgentLoop = { agent, loop }
		const satisfiedRules = loop.rules.filter((rule) => rule.condition.isSatisfiedBy(agentLoop))
		if (satisfiedRules.length === 0) {
			return undefined
		}

		const highestPriorityRule = satisfiedRules.reduce((highest, current) => {
			return highest.priority > current.priority ? highest : current
		})

		return highestPriorityRule.action.execute(agentLoop)
	}
}
