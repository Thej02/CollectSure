# CollectSure

> **Secure Parcel Verification System for College Hostels**

CollectSure is a full-stack web application that enables secure parcel collection within college hostels through OTP verification. It ensures that every parcel is handed over only to the intended student, reducing unauthorized pickups, parcel theft, and delivery errors.


## Problem Statement

In many college hostels, parcels are delivered to the security gate and handed over without any proper verification. Students often collect parcels by simply stating their name, which can lead to:

* Unauthorized parcel collection
* Parcel theft
* Wrong deliveries
* Lack of delivery verification

CollectSure solves this problem by introducing a secure OTP-based parcel verification process between students and hostel security.

## Objective

To provide a secure, reliable, and easy-to-use parcel management system that improves hostel security while simplifying the parcel collection process for both students and security personnel.

## Features

### Student Portal

* Raise a Parcel Ticket
* Enter:

  * Full Name
  * Phone Number
  * Email Address
  * Year
  * Hostel Block
  * Parcel Description
* Track parcel status
* Receive OTP through registered email
* View current parcel details

### Security Portal

* Secure Login
* Search students by Name or Phone Number
* View all pending parcel tickets
* Generate OTP when parcel arrives
* Verify OTP
* Mark parcel as delivered

## Workflow

```text
Student
    │
    │ Raises Parcel Ticket
    │
    ▼
Database

        ↓

Security Guard
    │
    │ Parcel Arrives
    │ Searches Student
    │
    ▼
Generate OTP
    │
    ▼
OTP Sent to Student (Email)
    │
    ▼
Student Reaches Security Gate
    │
    ▼
Student Shares OTP
    │
    ▼
Security Verifies OTP
    │
    ▼
Parcel Delivered ✅
```

## Parcel Status

* Pending
* OTP Generated
* Delivered

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript (ES6+)
* React Router DOM
* Axios
* CSS3
* React Toastify
* Lucide React

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Validation
* Spring Boot Mail (JavaMailSender)
* Lombok
* Maven

### Database

* MySQL

### Development Tools

* IntelliJ IDEA
* Visual Studio Code
* MySQL Workbench
* Postman
* Git
* GitHub

## Project Structure

```text
CollectSure/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── config/
│   │   ├── exception/
│   │   └── CollectSureApplication.java
│   ├── pom.xml
│   └── application.properties
│
└── README.md
```

## 🗄️ Database Schema

| Column             | Description               |
| ------------------ | ------------------------- |
| id                 | Parcel ID                 |
| student_name       | Student Name              |
| phone_number       | Phone Number              |
| email              | Email Address             |
| year               | Academic Year             |
| hostel_block       | Hostel Block              |
| parcel_description | Parcel Details            |
| status             | Current Status            |
| otp                | Generated OTP             |
| otp_generated_at   | OTP Generation Timestamp  |
| delivery_time      | Delivery Timestamp        |
| created_at         | Ticket Creation Timestamp |

## 📡 REST API Endpoints

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| POST   | `/api/parcels`                   | Create a parcel ticket        |
| GET    | `/api/parcels`                   | Retrieve all parcel tickets   |
| GET    | `/api/parcels/search?name=`      | Search student                |
| POST   | `/api/parcels/{id}/generate-otp` | Generate OTP                  |
| POST   | `/api/parcels/{id}/verify`       | Verify OTP and deliver parcel |

## OTP Verification

* Generates a secure random 6-digit OTP
* Sends OTP to the student's registered email
* OTP is never displayed on the website
* OTP remains valid until the parcel is collected
* OTP becomes invalid immediately after successful verification
* OTP cannot be reused

## Future Enhancements

* SMS OTP Integration
* Mobile Application
* QR Code-Based Verification
* Push Notifications
* Multi-Hostel Support
* Cloud Deployment
* Analytics Dashboard

## Getting Started

### Prerequisites

* Java 21
* Node.js
* MySQL
* Maven
* Git

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
## Key Highlights

* Full Stack Web Application
* OTP-Based Parcel Verification
* Secure Student & Security Workflow
* RESTful API Architecture
* Responsive User Interface
* MySQL Database Integration
* Spring Boot Email Service
* Real-World Problem Solving

## License
This project is developed for educational and learning purposes.
