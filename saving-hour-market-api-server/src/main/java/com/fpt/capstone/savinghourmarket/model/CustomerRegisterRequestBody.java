package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Validated
public class CustomerRegisterRequestBody {

    @NotNull
    private String fullName;

    @NotNull
    private String password;

    @NotNull
    private String email;

    @NotNull
    private String phone;

    @NotNull
    private String dateOfBirth;

    private String avatarUrl;

    @NotNull
    private String address;

    @NotNull
    private Integer gender;

}
