# email_service.py
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import logging
from database import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_server = settings.smtp_server
        self.smtp_port = settings.smtp_port
        self.username = settings.smtp_username
        self.password = settings.smtp_password
        self.app_name = settings.app_name

    async def send_email(
            self,
            to_email: str,
            subject: str,
            html_body: str,
            text_body: Optional[str] = None
    ) -> bool:
        """Send email using SMTP"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.app_name} <{self.username}>"
            message["To"] = to_email

            # Add text version if provided
            if text_body:
                text_part = MIMEText(text_body, "plain")
                message.attach(text_part)

            # Add HTML version
            html_part = MIMEText(html_body, "html")
            message.attach(html_part)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_server,
                port=self.smtp_port,
                start_tls=True,
                username=self.username,
                password=self.password,
            )

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_verification_email(self, to_email: str, verification_link: str) -> bool:
        """Send email verification email"""
        subject = f"Verify your {self.app_name} account"

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e1e5e9;
                    border-top: none;
                }}
                .button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin: 20px 0;
                }}
                .footer {{
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6c757d;
                    border-radius: 0 0 10px 10px;
                }}
                .warning {{
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{self.app_name}</h1>
                <p>Welcome! Please verify your email address</p>
            </div>

            <div class="content">
                <h2>Verify Your Email Address</h2>
                <p>Thank you for signing up for {self.app_name}! To complete your registration and secure your account, please verify your email address by clicking the button below:</p>

                <div style="text-align: center;">
                    <a href="{verification_link}" class="button">Verify Email Address</a>
                </div>

                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                    {verification_link}
                </p>

                <div class="warning">
                    <strong>Security Notice:</strong> This verification link will expire in 24 hours for your security. If you didn't create an account with {self.app_name}, please ignore this email.
                </div>
            </div>

            <div class="footer">
                <p>This email was sent to {to_email}</p>
                <p>© 2025 {self.app_name}. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        text_body = f"""
        Welcome to {self.app_name}!

        Please verify your email address by visiting this link:
        {verification_link}

        This link will expire in 24 hours for your security.

        If you didn't create an account with {self.app_name}, please ignore this email.
        """

        return await self.send_email(to_email, subject, html_body, text_body)

    async def send_password_reset_email(self, to_email: str, reset_link: str) -> bool:
        """Send password reset email"""
        subject = f"Reset your {self.app_name} password"

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e1e5e9;
                    border-top: none;
                }}
                .button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin: 20px 0;
                }}
                .footer {{
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6c757d;
                    border-radius: 0 0 10px 10px;
                }}
                .warning {{
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{self.app_name}</h1>
                <p>Password Reset Request</p>
            </div>

            <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password for your {self.app_name} account. If you made this request, click the button below to set a new password:</p>

                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">Reset Password</a>
                </div>

                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                    {reset_link}
                </p>

                <div class="warning">
                    <strong>Security Notice:</strong> This password reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                </div>
            </div>

            <div class="footer">
                <p>This email was sent to {to_email}</p>
                <p>© 2025 {self.app_name}. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        text_body = f"""
        Password Reset Request for {self.app_name}

        We received a request to reset your password. If you made this request, visit this link to set a new password:
        {reset_link}

        This link will expire in 1 hour for your security.

        If you didn't request a password reset, please ignore this email.
        """

        return await self.send_email(to_email, subject, html_body, text_body)

    async def send_2fa_enabled_notification(self, to_email: str) -> bool:
        """Send notification when 2FA is enabled"""
        subject = f"Two-Factor Authentication enabled on your {self.app_name} account"

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>2FA Enabled</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #2ed573 0%, #17c0eb 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e1e5e9;
                    border-top: none;
                }}
                .footer {{
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6c757d;
                    border-radius: 0 0 10px 10px;
                }}
                .success {{
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{self.app_name}</h1>
                <p>Security Update</p>
            </div>

            <div class="content">
                <h2>Two-Factor Authentication Enabled</h2>

                <div class="success">
                    <strong>Great news!</strong> Two-factor authentication has been successfully enabled on your {self.app_name} account.
                </div>

                <p>Your account is now more secure with two-factor authentication. Here's what this means:</p>

                <ul>
                    <li><strong>Enhanced Security:</strong> Even if someone gets your password, they won't be able to access your account without your authenticator app.</li>
                    <li><strong>Backup Codes:</strong> Make sure to save your backup codes in a secure location. You can use them if you lose access to your authenticator app.</li>
                    <li><strong>Login Process:</strong> From now on, you'll need to enter a code from your authenticator app when logging in.</li>
                </ul>

                <p>If you didn't enable two-factor authentication, please contact our support team immediately.</p>
            </div>

            <div class="footer">
                <p>This email was sent to {to_email}</p>
                <p>© 2025 {self.app_name}. All rights reserved.</p>
            </div>
        </body>
        </html>
        """

        return await self.send_email(to_email, subject, html_body)


# Initialize email service
email_service = EmailService()