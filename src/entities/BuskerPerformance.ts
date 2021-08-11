import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Busker } from './Busker'


@Entity()
export class BuskerPerformance {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(type => Busker, busker => busker.id)
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
}