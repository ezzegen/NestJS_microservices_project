import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RoleEntity } from './role/role.entity';
import { AuthEntity } from './auth/entities/auth.entity';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module ({
  imports: [
  // Path to .env-file. NB! in package.json add cross-env in scripts start, start:dev.
  ConfigModule.forRoot({
    envFilePath: `./.env`,
  }),
  // Connect to database
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
      RoleEntity,
      AuthEntity,
    ],
    autoLoadEntities: true,
    //NB! attr synchronize is not safe for prod, migrations is better.
    synchronize: true,
  }),
  RoleModule,
  AuthModule,
],
})
export class AppModule {}
