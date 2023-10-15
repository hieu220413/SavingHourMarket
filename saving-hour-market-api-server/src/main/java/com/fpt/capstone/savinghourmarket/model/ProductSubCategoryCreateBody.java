package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Validated
public class ProductSubCategoryCreateBody {
    @NotNull
    private String name;

    @NotNull
    private String imageUrl;

    @NotNull
    private Integer allowableDisplayThreshold;

    @NotNull
    private UUID productCategoryId;
}
