-- MySQL Database Creation Script for CollectSure
CREATE DATABASE IF NOT EXISTS collectsure_db;
USE collectsure_db;

-- 1. Create security_guards Table
CREATE TABLE IF NOT EXISTS security_guards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create parcels Table
CREATE TABLE IF NOT EXISTS parcels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    year VARCHAR(10) NOT NULL,
    hostel_block VARCHAR(50) NOT NULL,
    parcel_brand VARCHAR(50) NOT NULL,
    parcel_description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    otp VARCHAR(6) DEFAULT NULL,
    otp_generated_at TIMESTAMP DEFAULT NULL,
    delivery_time TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Default Security Guard (Allowed Gmail)
-- Default username: security@gmail.com / Default password: admin123
INSERT INTO security_guards (email, password, created_at)
VALUES ('security@gmail.com', 'admin123', NOW())
ON DUPLICATE KEY UPDATE email=email;
