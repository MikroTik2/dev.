import { Module } from '@nestjs/common';
import { MailsService } from '@/providers/mails/mails.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
            imports: [
                        MailerModule.forRoot({
                                    transport: {
                                                service: process.env.EMAIL_SERVICE,
                                                host: process.env.EMAIL_HOST,
                                                port: parseInt(process.env.EMAIL_PORT),
                                                secure: false,
                                                auth: {
                                                            user: process.env.EMAIL_USER,
                                                            pass: process.env.EMAIL_PASS,
                                                },
                                    },

                                    preview: true,
                        }),
            ],

            providers: [MailsService],
            exports: [MailsService],

})

export class MailsModule {};