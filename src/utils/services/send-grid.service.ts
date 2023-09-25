import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { AppConfig } from '../../common/config/app.config';
import { AppEnvironment } from '../../common/enums/app.enum';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService<AppConfig>) {}

  async sendDynamicTemplateEmail(data: SendGridTemplateParams) {
    sgMail.setApiKey(data.apiKey);

    const isLocal = [AppEnvironment.LOCAL, AppEnvironment.TEST].includes(
      this.configService.get('environment'),
    );
    if (isLocal) return;

    const msg: sgMail.MailDataRequired = {
      to: data.to,
      from: data.sender,
      templateId: data.templateId,
      dynamicTemplateData: data.dynamicTemplateData,
    };

    await sgMail.send(msg);
    console.log('send email success', msg);
  }
}

export interface SendGridTemplateParams {
  to: string[];
  dynamicTemplateData: Record<string, unknown>;
  templateId: string;
  apiKey: string;
  sender: string;
}
