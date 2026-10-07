import { LoopControlDirective } from "@agent/domain/loop/directive"
import { DirectiveExecutionStrategy } from "@agent/application/directive-execution/directive-execution-strategy"

export class DirectiveExecutionStrategyResolver {
	constructor(private readonly strategies: Record<LoopControlDirective["type"], DirectiveExecutionStrategy>) {}

	resolve(directive: LoopControlDirective): DirectiveExecutionStrategy {
		return this.strategies[directive.type]
	}
}
