import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { RoleModule } from '../role/role.module';
import { RoleEntity } from '../role/role.entity';

// Need packages <npm i @nestjs/jwt bcryptjs>
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
    }),
    // Registration module JwtModule
    JwtModule.register({
      secret: process.env.PRIVATE_KEY ?? 'SECRET',
      signOptions: {
        expiresIn: '24h' // time of token shelf life
      }
    }),
    TypeOrmModule.forFeature([AuthEntity, RoleEntity]),
    forwardRef(() => RoleModule),
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}

