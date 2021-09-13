import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Busker } from './Busker'
import { BuskerPerformanceComment } from './BuskerPerformanceComment'

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, nullable: false })
  @IsDefined()
  @Expose()
  account: string;
  @Column({ length: 20, nullable: false })
  @IsDefined()
  @Expose()
  password: string;
  @Column({ nullable: false })
  @IsDefined()
  @Expose()
  male: boolean;
  @Column({ length: 20, nullable: false })
  @IsDefined()
  @Expose()
  email: string;
  @Column({ length: 20, nullable: false })
  @IsDefined()
  @Expose()
  name: string;
  @Column({ default: 0, nullable: true })
  exp: number;
  @Column("longblob", { default: null, nullable: true })
  avatar: Buffer;
  // @OneToMany(type => Busker, busker => busker.memberId, { cascade: true })
  @OneToMany(type => Busker, busker => busker.memberId)
  buskers: Busker[];
  @OneToMany(type => BuskerPerformanceComment, comment => comment)
  buskerPerformanceComments: BuskerPerformanceComment[];
}

export class LoginType {
  account: string
  password: string
  constructor(account: string, password: string) {
    this.account = account
    this.password = password
  }
}
export type FrontEndMemberDataType = {
  account: string
  male: boolean
  email: string
  name: string
  exp: number
  avatar: string
  isBusker: boolean
}
export class UpdateMemberInfoType {
  name: string
  email: string
  avatar: Buffer
  constructor(name: string, email: string, avatar: Buffer = null) {
    this.name = name
    this.email = email
    this.avatar = avatar
  }
}
export class UpdatePassword {
  @IsDefined()
  @Expose()
  oldPassword: string
  @IsDefined()
  @Expose()
  newPassword: string
  constructor(oldPassword: string, newPassword: string) {
    this.newPassword = newPassword
    this.oldPassword = oldPassword
  }
}