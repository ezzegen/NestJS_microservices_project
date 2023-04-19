import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileEntity } from './entity/profile.entity';
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
    }),
    TypeOrmModule.forFeature([ProfileEntity]),
    ClientsModule.register([
        {
          name: 'AUTH_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_AUTH_QUEUE,
            queueOptions: {
              durable: false
            },
          },
        },
        ])
  ],
  exports: [
    ProfileService,
  ]
})
export class ProfileModule {}
