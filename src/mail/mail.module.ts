import { Module } from '@nestjs/common';
import { join } from 'path';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from './mail.service';
import {ConfigService } from '@nestjs/config';

function f() {
  console.log("Hello" + process.env.SMTP_HOST)
  return process.env.SMTP_HOST
}
//Todo - прочитать за динамические модули и видео за usefactory

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
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
