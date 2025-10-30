import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InterviewGatewayController } from './interview-gateway.controller';
import { SERVICES, INTERVIEW_SERVICE_QUEUE } from '../../../../src/common/constants/services';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.INTERVIEW_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: INTERVIEW_SERVICE_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InterviewGatewayController],
})
export class InterviewGatewayModule {}
