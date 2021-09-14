import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined, Matches, IsDate } from "class-validator";
import { Member } from './Member'

import { Busker } from './Busker'
import { BuskerPerformance } from './BuskerPerformance'


@Entity()
export class BuskerPerformanceComment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsDefined()
  @Expose()
  buskerId: number;
  @Column()
  @IsDefined()
  @Expose()
  performanceId: number;
  @Column()
  @IsDefined()
  @Expose()
  memberId: number
  @Column()
  @IsDefined()
  @Expose()
  comment: string;
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  @IsDefined()
  @Expose()
  time: string;
  @ManyToOne(type => Member, member => member.buskerPerformanceComments, { onDelete: 'CASCADE' })
  @JoinColumn()
  member: Member
  @ManyToOne(type => Busker, busker => busker.performances, { onDelete: 'CASCADE' })
  @JoinColumn()
  busker: Busker
  @ManyToOne(type => BuskerPerformance, performance => performance.buskerPerformanceComments, { onDelete: 'CASCADE' })
  @JoinColumn()
  buskerPerformance: BuskerPerformance


  constructor(buskerId: number, performanceId: number, memberId: number, comment: string, time: string) {
    this.buskerId = buskerId
    this.performanceId = performanceId
    this.memberId = memberId
    this.comment = comment
    this.time = time
  }


}
export type FrontEndCommentDataType = {
  account: string
  comment: string,
  time: Date
}
export type FrontEndHighestComentAmountType = {
  count: number,
  time: Date
}
export type FrontEndWeekCommentAmountType = {
  count: number
  time: string
}
