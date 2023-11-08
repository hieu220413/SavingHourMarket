package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DiscountUpdate {
    @NotNull
    private UUID id;

    private String name;

    private Integer percentage;

    private Integer spentAmountRequired;

    private LocalDate expiredDate;

    private String imageUrl;

    private Integer quantity;

    private UUID productCategoryId;
}
