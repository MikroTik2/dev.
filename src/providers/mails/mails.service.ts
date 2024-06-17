import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
      constructor(
            private readonly mailerService: MailerService,
            private readonly configService: ConfigService,
      ) {};

      public onSendForgotPassword(email: string, token: string): void {
            this.mailerService.sendMail({
                        to: this.configService.get('EMAIL_USER'),
                        from: email,
                        subject: "Reset password instructions",
                        text: "Forgot your password? If you didn't forget your password, please ignore this email!",                      
                        html: `
                              <div>
                                    <p>Hello <a href="mailto:${email}" target="_blank">${email}</a>!</p>
            
                                    <p>Someone has requested a link to change your password. You can do this through the link below.</p>
            
                                    <p><a href="${`http://localhost:${process.env.PORT}/api/v2/auth/reset-password?token=${token}`}">Change my password</a></p>
            
                                    <p>If you didn't request this, please ignore this email.</p>
                                    <p>Your password won't change until you access the link above and create a new one.</p>
                              </div>
                        `,
            })
      };

      public onSendDestroyAccount(username: string, email: string, token: string): void {
            this.mailerService.sendMail({
                  to: email,
                  from: this.configService.get('EMAIL_USER'),
                  subject: `Account Deletion Requested`,
                  html: `
                        <div style="font-family:&quot;HelveticaNeue-Light&quot;,&quot;Helvetica Neue Light&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;background:#fcfcfc;padding:1% 0">
                        <table style="width:100%;max-width:700px;margin:15px auto;font-size:18px;border:solid 1px #e6e6e6;border-radius:12px;display:block;padding:2px 1%;text-decoration:none;background:white">
                              <tbody>
                                    <tr>
                                          <td style="padding:2%">
                                                <p>
                                                      Hi ${username},
                                                </p>
                        
                                                <p>
                                                      Your account deletion was requested. Please, visit
                                                      <a href="${`http://localhost:3000/api/v2/users/confirm_destroy?token=${token}`}">this page</a> to destroy your account. The link will expire in 12 hours.
                                                </p>
                        
                                                <p>
                                                      Contact us at <a href="mailto:dotsenk20034@gmail.com" target="_blank">dotsenk20034@gmail.com</a> if there is anything more we can help with.
                                                </p>
                                                      
                                                <p>
                                                      Thanks,
                                                      <br>
                                                      The DEV. Community Team
                                                </p>
                        
                                          </td>
                                    </tr>
                              </tbody>
                        </table>
                        </div>
                  `,
            })
      };

      public onSendVerification(username: string, email: string, token: string): void {
            this.mailerService.sendMail({
                  from: this.configService.get('EMAIL_USER'),
                  to: email,
                  subject: `${username}, confirm your DEV Community account`,
                  html: `
                       <div>
                            <p>Welcome ${username}!</p>
                            <p>You can confirm your account email through the link below:</p>
                            <p>
                            <a href="${`http://localhost:${process.env.PORT}/api/v2/auth/confirmation_token?token=${token}`}">Confirm my account</a></p>
                       </div>
                  `,
            });
      };
};