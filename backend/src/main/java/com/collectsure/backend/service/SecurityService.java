package com.collectsure.backend.service;

import com.collectsure.backend.dto.LoginDTO;
import com.collectsure.backend.entity.SecurityGuard;
import com.collectsure.backend.repository.SecurityGuardRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityService {

    private final SecurityGuardRepository securityGuardRepository;

    /**
     * Seeds a default security guard email if the repository is empty.
     */
    @PostConstruct
    @Transactional
    public void seedDefaultGuard() {
        if (securityGuardRepository.count() == 0) {
            log.info("No security guards found. Seeding default guard account: security@gmail.com / admin123");
            SecurityGuard defaultGuard = SecurityGuard.builder()
                    .email("security@gmail.com")
                    .password("admin123") // Standard password for demo
                    .build();
            securityGuardRepository.save(defaultGuard);
        }
    }

    /**
     * Authenticates a security guard based on registered email and password.
     */
    @Transactional(readOnly = true)
    public boolean authenticate(LoginDTO loginDTO) {
        String email = loginDTO.getEmail().trim().toLowerCase();
        log.info("Authenticating login attempt for email: {}", email);
        
        Optional<SecurityGuard> guardOpt = securityGuardRepository.findByEmail(email);
        if (guardOpt.isPresent()) {
            SecurityGuard guard = guardOpt.get();
            // Matching password directly for development simplicity
            return guard.getPassword().equals(loginDTO.getPassword());
        }
        
        log.warn("Authentication failed: email {} not found in allowed list", email);
        return false;
    }
}
