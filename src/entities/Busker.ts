import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Member } from './Member'
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
  @ManyToOne(type => Member, member => member.id) member: Member;
  memberId: number;
  @IsDefined()
  @Expose()
  @Column()
  kind: BuskerKind;//街頭藝人種類
  @IsDefined()
  @Expose()
  @Column()
  description: string
}