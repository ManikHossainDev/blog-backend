import { Verification } from "./../../generated/prisma/browser";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD_SECRET,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.TRUSTED_ORIGINS!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignInUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const Verification = `${process.env.TRUSTED_ORIGINS}verify-email?token=${token}`;

        const htmlTemplate = `
               <!DOCTYPE html>
                  <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verify Your Email</title>
                      </head>
                      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td align="center" style="padding: 40px 0;">
                              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                
                                <!-- Header -->
                                <tr>
                                  <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Prisma Blog</h1>
                                  </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                  <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: bold;">Verify Your Email Address</h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                      Thank you for signing up with Prisma Blog! We're excited to have you on board.
                                    </p>
                                    
                                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                      To complete your registration and access all features, please verify your email address by clicking the button below:
                                    </p>
                                    
                                    <!-- Button -->
                                    <table role="presentation" style="margin: 0 auto;">
                                      <tr>
                                        <td style="border-radius: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                          <a href="${Verification}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">
                                            Verify Email Address
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                    
                                    <p style="margin: 30px 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                      Or copy and paste this link into your browser:
                                    </p>
                                    
                                    <p style="margin: 0 0 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all;">
                                      <a href="${Verification}" style="color: #667eea; text-decoration: none; font-size: 14px;">${Verification}</a>
                                    </p>
                                    
                                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                      This link will expire in 24 hours for security reasons.
                                    </p>
                                    
                                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                      If you didn't create an account with Prisma Blog, please ignore this email.
                                    </p>
                                  </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                  <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                                      © 2024 Prisma Blog. All rights reserved.
                                    </p>
                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                      This is an automated email, please do not reply.
                                    </p>
                                  </td>
                                </tr>
                                
                              </table>
                            </td>
                          </tr>
                        </table>
                  </body>
                </html>
              `;

        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: `Hello ` + user.name + `, please verify your email address`,
          html: htmlTemplate,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
    },
  },
});
