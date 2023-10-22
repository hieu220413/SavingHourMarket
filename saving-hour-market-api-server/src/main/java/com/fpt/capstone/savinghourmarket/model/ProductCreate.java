package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductCreate {

    @NotNull
    private String name;

    @NotNull
    @Positive
    private Integer price;

    @NotNull
    @Positive
    private Integer priceOriginal;

    @NotNull
    private String description;

    @NotNull
    private LocalDate expiredDate;

    @NotNull
    private Integer quantity;

    @NotNull
    private String imageUrl;

    @NotNull
    private ProductSubCategory productSubCategory;

    @NotNull
    private Supermarket supermarket;

}
