import { SharedState } from "@environment/shared-state"

export class RuntimeService<TSharedState extends SharedState> {
	constructor(public readonly state: TSharedState) {}
}
