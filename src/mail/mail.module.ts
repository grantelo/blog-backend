import { Module } from '@nestjs/common';
import {MailerModule} from "@nestjs-modules/mailer";
import { MailService } from './mail.service';
import {ConfigService } from '@nestjs/config';

function f() {
  return process.env.SMTP_HOST
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
      transport: {
        host: f(),
        port: +process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      }}),
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
