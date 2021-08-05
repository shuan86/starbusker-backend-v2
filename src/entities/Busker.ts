import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Member } from './Member'
enum BuskerKind {
  singer,
  drawer,
  other
}


@Entity()
export class Busker {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Member, member => member.id) member: Member;
  memberId: number;
  @Column()
  kind: BuskerKind;//街頭藝人種類


}