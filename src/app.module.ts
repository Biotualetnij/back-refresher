import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HtmlToJsonService } from './html-to-json/html-to-json.service';
import { ProxyRequestService } from './proxy-request/proxy-request.service';
import { HashService } from './hash/hash.service';
import { LockerService } from './locker/locker.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, HtmlToJsonService, ProxyRequestService, HashService, LockerService],
})
export class AppModule {}
