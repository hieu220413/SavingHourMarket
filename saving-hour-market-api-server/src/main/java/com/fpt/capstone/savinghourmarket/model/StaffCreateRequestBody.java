package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.StaffRole;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@AllArgsConstructor
@Validated
public class StaffCreateRequestBody {

    @NotNull
    private String fullName;

    @NotNull
    private String email;

    @NotNull
    private String password;

}
