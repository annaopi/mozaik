import { Space } from "@space/domain/space"

export interface SpaceRepository {
	save(space: Space): Promise<void>
	delete(id: string): Promise<void>
	findById(id: string): Promise<Space | undefined>
}
