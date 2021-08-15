import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Member } from './Member'
import { BuskerPerformance } from "./BuskerPerformance";
export enum BuskerKind {
  other,
  singer,
  drawer,
  drummer
}


@Entity()
export class Busker {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  memberId: number;
  @IsDefined()
  @Expose()
  @Column()
  type: BuskerKind;//街頭藝人種類
  @IsDefined()
  @Expose()
  @Column()
  description: string
  @ManyToOne(type => Member, member => member.buskers, { onDelete: 'CASCADE' })
  member: Member;
  @OneToMany(type => BuskerPerformance, busker => busker.buskerId, { cascade: true })
  performances: BuskerPerformance[]
}
//front-end request format
export class EnrollBuskerType {
  description: string
  type: BuskerKind
  constructor(description: string, type: BuskerKind) {
    this.description = description
    this.type = type
  }
}