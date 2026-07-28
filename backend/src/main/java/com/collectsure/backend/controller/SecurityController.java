package com.collectsure.backend.controller;

import com.collectsure.backend.dto.LoginDTO;
import com.collectsure.backend.service.SecurityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
@Slf4j
public class SecurityController {

    private final SecurityService securityService;

    /**
     * POST /api/security/login
     * Authenticates a security guard. Returns success message and email if allowed.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        boolean isAuthenticated = securityService.authenticate(loginDTO);
        if (isAuthenticated) {
            log.info("Security login successful for: {}", loginDTO.getEmail());
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Login Successful",
                    "email", loginDTO.getEmail()
            ));
        } else {
            log.warn("Security login failed for: {}", loginDTO.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "error",
                    "message", "Invalid email or password. Access is restricted to allowed security gmails."
            ));
        }
    }
}
