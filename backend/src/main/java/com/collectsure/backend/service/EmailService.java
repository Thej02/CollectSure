package com.collectsure.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends a professionally styled HTML OTP email to the student.
     *
     * @param toEmail      Recipient email address.
     * @param studentName  Name of the student.
     * @param otp          The 6-digit one-time password.
     * @param parcelBrand  Brand/Provider of the parcel (e.g., Amazon, Flipkart).
     */
    public void sendOtpEmail(String toEmail, String studentName, String otp, String parcelBrand) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CollectSure - Secure Parcel OTP: " + otp);

            // Constructing a beautiful, responsive HTML email body matching the blue & white theme
            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fa; padding: 40px 20px; text-align: center; color: #333333;\">"
                    + "  <div style=\"max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border-top: 5px solid #0056b3;\">"
                    + "    <div style=\"background-color: #0056b3; padding: 25px; color: #ffffff;\">"
                    + "      <h2 style=\"margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;\">CollectSure</h2>"
                    + "      <p style=\"margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;\">Hostel Parcel Collection Secure Verification</p>"
                    + "    </div>"
                    + "    <div style=\"padding: 30px; text-align: left;\">"
                    + "      <p style=\"font-size: 16px; line-height: 1.5; color: #555555;\">Hello <strong>" + studentName + "</strong>,</p>"
                    + "      <p style=\"font-size: 16px; line-height: 1.5; color: #555555;\">Your parcel from <strong>" + parcelBrand + "</strong> has arrived at the hostel security gate. Please use the OTP below to collect your parcel:</p>"
                    + "      <div style=\"background-color: #f0f7ff; border: 1px dashed #0056b3; border-radius: 8px; padding: 15px; text-align: center; margin: 25px 0;\">"
                    + "        <span style=\"font-size: 32px; font-weight: 700; color: #0056b3; letter-spacing: 5px;\">" + otp + "</span>"
                    + "      </div>"
                    + "      <p style=\"font-size: 14px; line-height: 1.5; color: #666666;\"><strong>Instructions:</strong></p>"
                    + "      <ul style=\"font-size: 14px; color: #666666; padding-left: 20px; line-height: 1.6;\">"
                    + "        <li>Share this OTP only with the security guard at the gate.</li>"
                    + "        <li>This OTP is valid until the parcel is successfully collected.</li>"
                    + "        <li>Do not share this OTP with anyone else.</li>"
                    + "      </ul>"
                    + "    </div>"
                    + "    <div style=\"background-color: #fafafa; padding: 15px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;\">"
                    + "      This is an automated security system notification. Please do not reply directly to this email."
                    + "    </div>"
                    + "  </div>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Secure OTP email sent successfully to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email sending failed. Please check backend log and SMTP configuration.");
        }
    }
}
