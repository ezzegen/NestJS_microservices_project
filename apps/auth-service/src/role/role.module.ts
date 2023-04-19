import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [RoleService],
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    forwardRef(() => AuthModule),
  ],
  exports: [RoleService]
})
export class RoleModule {}
