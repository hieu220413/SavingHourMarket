package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupermarketAddressCreateBody {
    @NotNull
    private String address;
    @NotNull
    private UUID pickupPointId;
}
