import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Busker } from './Busker'

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

}

