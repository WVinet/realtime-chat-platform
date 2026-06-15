import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    MessagesModule,
    GamesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
