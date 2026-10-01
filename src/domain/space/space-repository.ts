import { Space } from "@domain/space/space"

export interface SpaceRepository {
	save(space: Space): Promise<void>
	delete(id: string): Promise<void>
	getById(id: string): Promise<Space | undefined>
	getAllByOwnerId(ownerId: string): Promise<Space[]>
}
