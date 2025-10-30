import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Global()
@Module({
  imports: [JwtModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway, SocketService],
})
export class SocketModule {}
