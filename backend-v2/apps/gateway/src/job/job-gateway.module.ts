import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobGatewayController } from './job-gateway.controller';
import { SERVICES, JOB_SERVICE_QUEUE } from '../../../../src/common/constants/services';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.JOB_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: JOB_SERVICE_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [JobGatewayController],
})
export class JobGatewayModule {}
