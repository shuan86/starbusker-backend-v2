import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Busker } from './Busker'


@Entity()
export class BuskerPerformance {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  buskerId: number;
  @IsDefined()
  @Expose()
  @Column()
  title: string;//街頭藝人種類
  @IsDefined()
  @Expose()
  @Column()
  description: string
  @IsDefined()
  @Expose()
  @Column({ type: 'datetime', default: () => 'NOW()' })
  time: Date
  @Column()
  lineMoney: number
  @Column({ type: "double" })
  latitude: number
  @IsDefined()
  @Expose()
  @Column({ type: "double" })
  longitude: number
  @IsDefined()
  @Expose()
  @Column()
  location: string
  @ManyToOne(type => Busker, busker => busker.performances, { onDelete: 'CASCADE' })
  busker: Busker
}
//front-end request format
export class ApplyPerformanceType {
  tile: string
  description: string
  time: Date
  location: string
  constructor(tile: string, description: string, time: Date, location: string) {
    this.tile = tile
    this.description = description
    this.time = time
    this.location = location
  }
}
export class GetPerformancesType {
  time: string
  page: number
  constructor(time: string, page: number) {
    this.time = time
    this.page = page
  }
}