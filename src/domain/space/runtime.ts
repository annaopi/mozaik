import { SharedState } from "@domain/space/shared-state"

export class RuntimeService<TSharedState extends SharedState> {
	constructor(public readonly state: TSharedState) {}
}
