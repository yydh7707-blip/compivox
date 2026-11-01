import nodemailer from "nodemailer";

export class SmtpMailer {
  constructor(smtp) {
    this.smtp = smtp;
    this.transport = smtp.host
      ? nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465,
          auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
          connectionTimeout: 8000,
          socketTimeout: 10000
        })
      : null;
  }
  get configured() { return !!this.transport && !!this.smtp.fromAddress; }
  async send(to, subject, text, html) {
    if (!this.configured) throw new Error("mail_not_configured");
    await this.transport.sendMail({
      from: { name: this.smtp.fromName, address: this.smtp.fromAddress },
      to, subject, text, html
    });
  }
}

const shell = (title, body) => `<!doctype html><html><body style="margin:0;background:#FFF9EF;font-family:Segoe UI,Arial,sans-serif;color:#17243A">
<div style="max-width:480px;margin:32px auto;background:#fff;border:1px solid #E8D6A8;border-radius:14px;padding:32px">
<div style="letter-spacing:.3em;font-size:12px;color:#9C793C;font-weight:600">COMPIVOX</div>
<h1 style="font-size:20px;margin:16px 0 8px">${title}</h1>${body}</div></body></html>`;

export function verificationEmail(code, ttlMin) {
  return {
    subject: "Your COMPIVOX verification code",
    text: `Your COMPIVOX verification code is ${code}. It expires in ${ttlMin} minutes. If you did not request it, ignore this email.\nCOMPIVOX 인증 코드: ${code} (${ttlMin}분 후 만료)`,
    html: shell("Verify your email", `<p style="color:#4a5568">Enter this code to continue. It expires in ${ttlMin} minutes.</p>
<div style="font-size:34px;letter-spacing:.35em;font-weight:700;color:#9C793C;background:#F1EBDD;border-radius:10px;padding:16px;text-align:center">${code}</div>
<p style="color:#718096;font-size:12px">If you did not request this, you can ignore this email.</p>`)
  };
}

export function resetEmail(code, ttlMin) {
  return {
    subject: "Your COMPIVOX password reset code",
    text: `Your COMPIVOX password reset code is ${code}. It expires in ${ttlMin} minutes. If you did not request it, ignore this email.\n비밀번호 재설정 코드: ${code} (${ttlMin}분 후 만료)`,
    html: shell("Reset your password", `<p style="color:#4a5568">Use this code to set a new password. It expires in ${ttlMin} minutes.</p>
<div style="font-size:34px;letter-spacing:.35em;font-weight:700;color:#9C793C;background:#F1EBDD;border-radius:10px;padding:16px;text-align:center">${code}</div>`)
  };
}
