package com.collectsure.backend.controller;

import com.collectsure.backend.dto.ParcelTicketDTO;
import com.collectsure.backend.dto.VerifyOtpDTO;
import com.collectsure.backend.entity.Parcel;
import com.collectsure.backend.service.ParcelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
@Slf4j
public class ParcelController {

    private final ParcelService parcelService;

    /**
     * POST /api/parcels
     * Raise a new parcel ticket.
     */
    @PostMapping
    public ResponseEntity<Parcel> raiseTicket(@Valid @RequestBody ParcelTicketDTO dto) {
        Parcel created = parcelService.createTicket(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * GET /api/parcels
     * Get all parcel tickets (default ordered by creation time).
     */
    @GetMapping
    public ResponseEntity<List<Parcel>> getAllTickets() {
        List<Parcel> tickets = parcelService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET /api/parcels/active
     * Get all active (Pending + OTP Generated) parcel tickets.
     */
    @GetMapping("/active")
    public ResponseEntity<List<Parcel>> getActiveTickets() {
        List<Parcel> tickets = parcelService.getActiveTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET /api/parcels/{id}
     * Get a specific parcel ticket by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Parcel> getTicketById(@PathVariable Long id) {
        Parcel parcel = parcelService.getTicketById(id);
        return ResponseEntity.ok(parcel);
    }

    /**
     * GET /api/parcels/search
     * Search student by name or phone number.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Parcel>> searchStudent(@RequestParam(value = "name", required = false) String name) {
        List<Parcel> tickets = parcelService.searchTickets(name);
        return ResponseEntity.ok(tickets);
    }

    /**
     * PUT /api/parcels/{id}
     * Edit a ticket (only allowed if status is 'Pending').
     */
    @PutMapping("/{id}")
    public ResponseEntity<Parcel> editTicket(@PathVariable Long id, @Valid @RequestBody ParcelTicketDTO dto) {
        Parcel updated = parcelService.editTicket(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/parcels/{id}/generate-otp
     * Generate secure 6-digit OTP and send to student email.
     */
    @PostMapping("/{id}/generate-otp")
    public ResponseEntity<Parcel> generateOtp(@PathVariable Long id) {
        Parcel updated = parcelService.generateOtp(id);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/parcels/{id}/verify
     * Verify the student's OTP.
     */
    @PostMapping("/{id}/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@PathVariable Long id, @Valid @RequestBody VerifyOtpDTO dto) {
        boolean isSuccess = parcelService.verifyOtp(id, dto.getOtp());
        if (isSuccess) {
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Parcel Delivered Successfully"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", "Invalid OTP"
            ));
        }
    }
}
