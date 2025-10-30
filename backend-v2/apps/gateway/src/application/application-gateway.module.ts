import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationGatewayController } from './application-gateway.controller';
import { SERVICES, APPLICATION_SERVICE_QUEUE } from '../../../../src/common/constants/services';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.APPLICATION_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: APPLICATION_SERVICE_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApplicationGatewayController],
})
export class ApplicationGatewayModule {}
