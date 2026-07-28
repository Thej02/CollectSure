package com.collectsure.backend.repository;

import com.collectsure.backend.entity.SecurityGuard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SecurityGuardRepository extends JpaRepository<SecurityGuard, Long> {

    // Find a security guard by their registered email address
    Optional<SecurityGuard> findByEmail(String email);
}
