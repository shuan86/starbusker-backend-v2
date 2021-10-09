import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, RelationId, JoinColumn } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Member } from './Member'
import { BuskerPerformance } from "./BuskerPerformance";
import { BuskerPerformanceComment } from "./BuskerPerformanceComment";

export enum BuskerType {
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
  type: BuskerType;//街頭藝人種類
  @IsDefined()
  @Expose()
  @Column()
  description: string
  @Column({ default: 0, nullable: true })
  likeAmount: number
  @Column({ length: 200 })
  linePayOrderId: string
  @Column()
  linePayTransactionId: string
  @Column({ length: 200 })
  linePayOrderUrl: string

  // @ManyToOne(type => Member, member => member.buskers, { onDelete: 'CASCADE' })
  @ManyToOne(type => Member, member => member.buskers)
  @JoinColumn()
  member: Member;
  @OneToMany(type => BuskerPerformance, performance => performance.buskerId, { cascade: true })
  performances: BuskerPerformance[]
  @OneToMany(type => BuskerPerformanceComment, comment => comment.buskerId, { cascade: true })
  buskerPerformanceComments: BuskerPerformanceComment[]

  constructor(memberId: number, type: BuskerType, description: string, likeAmount: number) {
    this.memberId = memberId
    this.type = type
    this.description = description
    this.likeAmount = likeAmount

  }
}
//front-end request format
export class EnrollBuskerType {
  description: string
  type: BuskerType
  constructor(description: string, type: BuskerType) {
    this.description = description
    this.type = type
  }
}
export class GetBuskerType {
  id: number
  constructor(id: number) {
    this.id = id
  }
}
export class GetPerformanceType {
  performanceId: number
  constructor(performanceId: number) {
    this.performanceId = performanceId
  }
}
export class ConfirmLinePayOrderType {
  transactionId: string
  orderId: string

  constructor(transactionId: string, orderId: string) {
    this.transactionId = transactionId
    this.orderId = orderId
  }
}