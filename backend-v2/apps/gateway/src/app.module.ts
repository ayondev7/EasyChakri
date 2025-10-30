import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { UserModule } from '../../../src/modules/user/user.module';
import { CompanyModule } from '../../../src/modules/company/company.module';
import { NotificationModule } from '../../../src/modules/notification/notification.module';
import { PrismaModule } from '../../../src/modules/prisma/prisma.module';
import { SocketModule } from '../../../src/modules/socket/socket.module';
import { JobGatewayModule } from './job/job-gateway.module';
import { ApplicationGatewayModule } from './application/application-gateway.module';
import { InterviewGatewayModule } from './interview/interview-gateway.module';
import { SERVICES, JOB_SERVICE_QUEUE, APPLICATION_SERVICE_QUEUE, INTERVIEW_SERVICE_QUEUE } from '../../../src/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    PrismaModule,
    AuthModule,
    UserModule,
    CompanyModule,
    NotificationModule,
    SocketModule,
    JobGatewayModule,
    ApplicationGatewayModule,
    InterviewGatewayModule,
  ],
})
export class AppModule {}
