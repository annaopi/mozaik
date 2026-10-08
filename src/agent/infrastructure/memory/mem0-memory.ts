import { Memory } from "@agent/domain/memory"
import { ContextItem } from "src"

export class Mem0Memory implements Memory {

    remember(items: ContextItem[], participantId: string): void {
        throw new Error("Method not implemented.")
    }

    recall(topic: string, participantId: string): ContextItem[] {
        throw new Error("Method not implemented.")
    }

}