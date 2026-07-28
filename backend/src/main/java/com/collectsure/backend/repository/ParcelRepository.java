package com.collectsure.backend.repository;

import com.collectsure.backend.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {

    // Retrieve all parcels ordered by creation date descending
    List<Parcel> findAllByOrderByCreatedAtDesc();

    // Search parcels by student name or phone number (case-insensitive for name)
    List<Parcel> findByStudentNameContainingIgnoreCaseOrPhoneNumberContainingOrderByCreatedAtDesc(String studentName, String phoneNumber);

    // Get all parcels that are not yet delivered (Pending or OTP Generated)
    List<Parcel> findByStatusInOrderByCreatedAtDesc(List<String> statuses);
}
