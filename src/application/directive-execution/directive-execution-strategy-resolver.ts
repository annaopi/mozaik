import { LoopControlDirective } from "@domain/agent/loop/directive"
import { DirectiveExecutionStrategy } from "./directive-execution-strategy"

export class DirectiveExecutionStrategyResolver {
	constructor(private readonly strategies: Record<LoopControlDirective["type"], DirectiveExecutionStrategy>) {}

	resolve(directive: LoopControlDirective): DirectiveExecutionStrategy {
		return this.strategies[directive.type]
	}
}
