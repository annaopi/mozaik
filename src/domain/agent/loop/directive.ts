import { ToolUseRequest } from "@domain/inference/context"
import { InferenceRequest } from "@domain/inference/inference-runner"

export type LoopControlDirective = InferenceDirective | ToolUseDirective | WaitDirective | CompleteDirective

export type InferenceDirective = { type: "inference"; request: InferenceRequest }
export type ToolUseDirective = { type: "tool_use"; call: ToolUseRequest }
export type WaitDirective = { type: "wait"; reason: string }
export type CompleteDirective = { type: "complete"; reason: string }
