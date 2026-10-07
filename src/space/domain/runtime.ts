import { SharedState } from "@space/domain/shared-state"

export class RuntimeService<TSharedState extends SharedState> {
	constructor(public readonly state: TSharedState) {}
}
