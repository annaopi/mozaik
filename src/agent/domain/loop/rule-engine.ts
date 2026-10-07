import { Loop } from "@agent/domain/loop/loop"
import { LoopControlDirective } from "@agent/domain/loop/directive"
import { AgentLoop } from "@agent/domain/loop/specification"
import { Agent } from "@agent/domain/agent"

export class RuleEngine {
	decide(agent: Agent, loop: Loop): LoopControlDirective | undefined {
		const agentLoop: AgentLoop = { agent, loop }
		const satisfiedRules = loop.ruleBook.getRules().filter((rule) => rule.condition.isSatisfiedBy(agentLoop))
		if (satisfiedRules.length === 0) {
			return undefined
		}

		const highestPriorityRule = satisfiedRules.reduce((highest, current) => {
			return highest.priority > current.priority ? highest : current
		})

		return highestPriorityRule.action.execute(agentLoop)
	}
}
