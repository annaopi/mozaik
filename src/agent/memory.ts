import { Context } from "@inference/context"

export interface Memory {
	getContext(): Context
}
