import dotenv from 'dotenv'
import { htmlToText } from 'html-to-text'
import nodemailer from 'nodemailer'
import { join } from 'path'
import { renderFile } from 'pug'

dotenv.config({ path: join(process.cwd(), '.env') })

export class Email {
  constructor(user, url) {
    this.url = url
    this.to = user.email
    this.from = `${process.env.COMPANY_NAME} <${process.env.EMAIL_FROM}>`
    this.firstName = user.firstName
  }
  createTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    })
  }
  async send(templatePath, subject) {
    const html = renderFile(join(process.cwd(), `src/views/${templatePath}`), {
      firstName: this.firstName,
      from: this.from,
      to: this.to,
      url: this.url,
      subject
    })
    try {
      await this.createTransport().sendMail({
        to: this.to,
        from: this.from,
        subject,
        text: htmlToText(html),
        html
      })
    } catch (error) {
      throw new Error(error.response)
    }
  }
  async forgotPassword() {
    await this.send('email/forgotPassword.pug', 'Password Reset')
  }
}
