package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@AllArgsConstructor
public class CustomerUpdateRequestBody {

    private String fullName;
    private String phone;
    private String dateOfBirth;
    private String address;
    private Integer gender;

}
