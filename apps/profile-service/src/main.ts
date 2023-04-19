import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = await app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],//['amqp://localhost:5672'],
        queue: process.env.RABBITMQ_PROFILE_QUEUE,//'auth_queue',
        // urls: ['amqp://localhost:5672'],
        // queue: 'profile_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
    { inheritAppConfig: true }
  );
  await app.startAllMicroservices();
}

bootstrap();
