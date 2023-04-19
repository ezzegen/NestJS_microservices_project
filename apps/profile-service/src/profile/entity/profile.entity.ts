import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Check,
} from 'typeorm';

import { IUserCreationProfileAttrs } from '../profile.interface';

// Model of table for user's profile-service.
@Entity({ name: 'user_profile' })
@Check(`"age" > 10`)
@Check(`"phone" > 10000000000`)
@Check(`"phone" < 99999999999`)
export class ProfileEntity implements IUserCreationProfileAttrs{

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column( {type: 'int', default: null, unique: true })
  auth_id: number;

  @Column({ length: 20, default: 'Your name' })
  name: string;

  @Column({ length: 20, default: 'Your surname' })
  surname: string;

  @Column({ type: 'integer', default: 18 })
  age: number;

  @Column({ type: 'bigint', nullable: true })
  phone: number;
}