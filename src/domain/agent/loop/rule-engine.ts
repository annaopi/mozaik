import { Loop } from "@domain/agent/loop/loop"
import { LoopControlDirective } from "@domain/agent/loop/directive"
import { AgentLoop } from "./specification"
import { Agent } from "@domain/agent/agent"

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
