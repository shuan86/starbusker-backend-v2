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
  @Column()
  time: string
  @Column()
  lineMoney: number
  @Column()
  latitude: number
  @IsDefined()
  @Expose()
  @Column()
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
  time: string
  location: string
  constructor(tile: string, description: string, time: string, location: string) {
    this.tile = tile
    this.description = description
    this.time = time
    this.location = location
  }
}