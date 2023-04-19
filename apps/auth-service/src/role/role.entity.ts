import { Entity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';

import { IRoleCreationAttrs } from './role.inteface';
import { AuthEntity } from '../auth/entities/auth.entity';

// Model of table for user's profile-service.
@Entity({ name: 'role' })
export class RoleEntity implements IRoleCreationAttrs {

  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ length: 20, unique: true})
  value: string;

  @Column({ length: 20 })
  description: string;

  @ManyToMany(
    () => AuthEntity,
    (auth) => auth.role,
    { onDelete: "CASCADE" })
  auth: AuthEntity[];
}
