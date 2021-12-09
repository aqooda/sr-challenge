import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ValidateDto } from './dto/validate.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/validate')
  @HttpCode(200)
  validate(@Body() validateDto: ValidateDto) {
    return this.appService.validate(validateDto);
  }
}
