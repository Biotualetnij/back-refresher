import { Controller, Get, Post, Res } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getRefreshedPage(@Body() body: any, @Res() res: Response) {
    let result = await this.appService.getRefreshedPage(
      body.url,
      res,
      body.firstTime,
      body.clientCode,
    );
    res.send(result);
  }
}
