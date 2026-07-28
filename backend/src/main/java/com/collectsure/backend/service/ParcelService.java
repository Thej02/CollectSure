package com.collectsure.backend.service;

import com.collectsure.backend.dto.ParcelTicketDTO;
import com.collectsure.backend.entity.Parcel;
import com.collectsure.backend.repository.ParcelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Creates a new parcel ticket with default status 'Pending'.
     */
    @Transactional
    public Parcel createTicket(ParcelTicketDTO dto) {
        log.info("Creating new parcel ticket for student: {}", dto.getStudentName());
        Parcel parcel = Parcel.builder()
                .studentName(dto.getStudentName().trim())
                .phoneNumber(dto.getPhoneNumber().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .year(dto.getYear())
                .hostelBlock(dto.getHostelBlock().trim())
                .parcelBrand(dto.getParcelBrand().trim())
                .parcelDescription(dto.getParcelDescription().trim())
                .status("Pending")
                .build();
        return parcelRepository.save(parcel);
    }

    /**
     * Retrieves all tickets in the system.
     */
    @Transactional(readOnly = true)
    public List<Parcel> getAllTickets() {
        return parcelRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Retrieves only pending/active tickets (status: Pending or OTP Generated).
     */
    @Transactional(readOnly = true)
    public List<Parcel> getActiveTickets() {
        return parcelRepository.findByStatusInOrderByCreatedAtDesc(Arrays.asList("Pending", "OTP Generated"));
    }

    /**
     * Retrieves a single parcel ticket by ID.
     */
    @Transactional(readOnly = true)
    public Parcel getTicketById(Long id) {
        return parcelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Parcel ticket not found with ID: " + id));
    }

    /**
     * Searches parcels by student name or phone number.
     */
    @Transactional(readOnly = true)
    public List<Parcel> searchTickets(String query) {
        log.info("Searching tickets with query: {}", query);
        if (query == null || query.trim().isEmpty()) {
            return getActiveTickets();
        }
        String cleanQuery = query.trim();
        return parcelRepository.findByStudentNameContainingIgnoreCaseOrPhoneNumberContainingOrderByCreatedAtDesc(cleanQuery, cleanQuery);
    }

    /**
     * Edits an existing parcel ticket. Only allowed if status is 'Pending'.
     */
    @Transactional
    public Parcel editTicket(Long id, ParcelTicketDTO dto) {
        log.info("Attempting to edit ticket ID: {}", id);
        Parcel parcel = getTicketById(id);

        if (!"Pending".equalsIgnoreCase(parcel.getStatus())) {
            throw new IllegalStateException("Ticket cannot be edited. Current status is: " + parcel.getStatus());
        }

        parcel.setStudentName(dto.getStudentName().trim());
        parcel.setPhoneNumber(dto.getPhoneNumber().trim());
        parcel.setEmail(dto.getEmail().trim().toLowerCase());
        parcel.setYear(dto.getYear());
        parcel.setHostelBlock(dto.getHostelBlock().trim());
        parcel.setParcelBrand(dto.getParcelBrand().trim());
        parcel.setParcelDescription(dto.getParcelDescription().trim());

        return parcelRepository.save(parcel);
    }

    /**
     * Generates a secure random 6-digit OTP, updates status, and emails it to the student.
     */
    @Transactional
    public Parcel generateOtp(Long id) {
        log.info("Generating OTP for ticket ID: {}", id);
        Parcel parcel = getTicketById(id);

        if ("Delivered".equalsIgnoreCase(parcel.getStatus())) {
            throw new IllegalStateException("Cannot generate OTP. Parcel has already been delivered.");
        }

        // Generate a random 6-digit number [100000, 999999]
        int otpNum = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(otpNum);

        parcel.setOtp(otp);
        parcel.setOtpGeneratedAt(LocalDateTime.now());
        parcel.setStatus("OTP Generated");

        Parcel saved = parcelRepository.save(parcel);

        // Send OTP email asynchronously / sequentially
        emailService.sendOtpEmail(saved.getEmail(), saved.getStudentName(), otp, saved.getParcelBrand());

        return saved;
    }

    /**
     * Verifies the 6-digit OTP for a parcel collection.
     */
    @Transactional
    public boolean verifyOtp(Long id, String inputOtp) {
        log.info("Verifying OTP for ticket ID: {}", id);
        Parcel parcel = getTicketById(id);

        if (!"OTP Generated".equalsIgnoreCase(parcel.getStatus())) {
            throw new IllegalStateException("OTP verification is only allowed when status is 'OTP Generated'.");
        }

        if (parcel.getOtp() == null || parcel.getOtp().trim().isEmpty()) {
            throw new IllegalStateException("No OTP has been generated for this parcel ticket.");
        }

        if (parcel.getOtp().equals(inputOtp.trim())) {
            log.info("OTP verification successful for ticket ID: {}", id);
            // Update database status
            parcel.setStatus("Delivered");
            parcel.setDeliveryTime(LocalDateTime.now());
            // Immediately invalidate the OTP so it cannot be reused
            parcel.setOtp(null);
            parcel.setOtpGeneratedAt(null);
            parcelRepository.save(parcel);
            return true;
        } else {
            log.warn("Invalid OTP entered for ticket ID: {}", id);
            return false;
        }
    }
}
