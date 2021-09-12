import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined, Matches, IsDate } from "class-validator";
import { Busker } from './Busker'
import { BuskerPerformanceComment } from "./BuskerPerformanceComment";


@Entity()
export class BuskerPerformance {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  buskerId: number;
  @IsDefined()
  @Expose()
  @Column()
  title: string;
  @IsDefined()
  @Expose()
  @Column()
  description: string
  @IsDefined()
  @Expose()
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  time: string
  @Column({ default: () => 0 })
  lineMoney: number
  @Column({ default: () => 0 })
  highestOnlineAmount: number
  @Column({ type: "double" })
  @IsDefined()
  @Expose()
  latitude: number
  @Column({ type: "double" })
  @IsDefined()
  @Expose()
  longitude: number
  @IsDefined()
  @Expose()
  @Column()
  location: string
  @ManyToOne(type => Busker, busker => busker.performances, { onDelete: 'CASCADE' })
  @JoinColumn()
  busker: Busker
  @OneToMany(type => BuskerPerformanceComment, comment => comment.performanceId, { cascade: true })
  buskerPerformanceComments: BuskerPerformanceComment[]
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
  @IsDefined()
  @Expose()
  time: string
  @IsDefined()
  @Expose()
  page: number
  constructor(time: string, page: number) {
    this.time = time
    this.page = page
  }
}
export class GetPerformanceType {
  @IsDefined()
  @Expose()
  performanceId: number
  constructor(id: number) {
    this.performanceId = id
  }
}
export type FrontEndPerformanceType = {
  performanceId: number
  name: string,
  email: string,
  location: string,
  description: string,
  title: string,
  time: string,
  longitude: number,
  latitude: number
}
export type FrontEndHighestOnlineAmountType = {
  highestOnlineAmount: number,
  time: string
}
export type FrontEndFuturePerformanceDataType = {
  performanceId: number
  name: string,
  email: string,
  location: string,
  description: string,
  title: string,
  time: string,
  longitude: number,
  latitude: number
}