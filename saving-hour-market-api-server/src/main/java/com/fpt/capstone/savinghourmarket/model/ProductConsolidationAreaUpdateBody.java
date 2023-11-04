package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductConsolidationAreaUpdateBody {
    @NotNull
    private String address;

    @NotNull
    private Double longitude;

    @NotNull
    private Double latitude;
}
