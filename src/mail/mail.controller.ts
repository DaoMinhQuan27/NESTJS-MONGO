import { Controller, Get } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailService } from './mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService , 
    ) {}

  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron(CronExpression.EVERY_WEEKEND)
  async handleTestEmail() {
    return this.mailService.sendMail();
  }
}
