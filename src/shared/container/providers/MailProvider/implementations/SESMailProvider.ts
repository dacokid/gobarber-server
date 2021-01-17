import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
// import mailConfig from '@config/mail';
import { inject, injectable } from 'tsyringe';

import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    this.client.sendMail({
      // Import defaults from mail.ts
      // const { name, email } = mailConfig.defaults?.from;

      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject: subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
