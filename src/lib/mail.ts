import "server-only";
import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.log(`\n[CORREO DE DESARROLLO] Para: ${to}\nAsunto: ${subject}\n${html.replace(/<[^>]+>/g, " ")}\n`);
    return { delivered: false };
  }
  const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await t.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
  return { delivered: true };
}
