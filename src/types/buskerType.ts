export class ApplyPerformanceType {
    tile: string
    description: string
    time: string
    location: string
    constructor(tile: string, description: string, time: string, location: string) {
        this.tile = tile
        this.description = description
        this.time = time
        this.location = location
    }
}