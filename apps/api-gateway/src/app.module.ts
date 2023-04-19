import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
    }),
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}
