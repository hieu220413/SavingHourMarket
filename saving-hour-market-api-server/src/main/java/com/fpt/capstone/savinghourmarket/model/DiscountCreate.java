package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DiscountCreate {

    @NotNull
    private String name;

    @NotNull
    private Integer percentage;

    @NotNull
    private Integer spentAmountRequired;

    @NotNull
    private LocalDate expiredDate;

    @NotNull
    private String imageUrl;

    @NotNull
    private Integer quantity;

    @NotNull
    private UUID productCategoryId;

}
