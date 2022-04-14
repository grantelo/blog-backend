import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendActivationMail(to: string, link: string): Promise<void> {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на: ' + process.env.API_URL,
      html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }

  public async sendResetPasswordMail(to: string, link: string) {
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Сброс пароля на: ' + process.env.CLIENT_URL,
      html: `
                    <div>
                        <h1>Для сброса пароля перейдите по ссылке</h1>
                        <a href="${link}">Сброс пароля</a>
                    </div>
                `,
    });
  }
}
