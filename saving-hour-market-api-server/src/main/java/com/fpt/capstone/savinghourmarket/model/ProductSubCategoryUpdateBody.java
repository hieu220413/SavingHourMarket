package com.fpt.capstone.savinghourmarket.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ProductSubCategoryUpdateBody {
    private String name;

    private String imageUrl;

    private Integer allowableDisplayThreshold;

    private UUID productCategoryId;
}
