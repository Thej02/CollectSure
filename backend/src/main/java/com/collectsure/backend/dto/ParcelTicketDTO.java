package com.collectsure.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelTicketDTO {

    @NotBlank(message = "Full Name is required.")
    private String studentName;

    @NotBlank(message = "Phone Number is required.")
    @Pattern(regexp = "^\\d{10}$", message = "Phone Number must contain exactly 10 digits.")
    private String phoneNumber;

    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be valid.")
    private String email;

    @NotBlank(message = "Year is required.")
    private String year;

    @NotBlank(message = "Hostel Block is required.")
    private String hostelBlock;

    @NotBlank(message = "Parcel Brand is required.")
    private String parcelBrand;

    @NotBlank(message = "Parcel Description is required.")
    private String parcelDescription;
}
