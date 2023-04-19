import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { IUserCreationAuthAttrs } from '../auth.interface';
import { RoleEntity } from '../../role/role.entity';

// Model of table for user's authorization
@Entity({ name: 'user_auth' })
export class AuthEntity implements IUserCreationAuthAttrs{

  @PrimaryGeneratedColumn({
    type: 'int',
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: number;

  @Column({
    length: 30,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @ManyToMany(
    () => RoleEntity,
    (role) => role.auth,
    { cascade: true, onDelete: "CASCADE" }
  )
  @JoinTable()
  role: RoleEntity[];
}