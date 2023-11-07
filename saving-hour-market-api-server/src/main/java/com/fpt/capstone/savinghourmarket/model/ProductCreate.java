package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
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
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductCreate {

    @NotNull
    private String name;

    @NotNull
    private String description;

    @NotNull
    private String unit;

    @NotNull
    private List<String> imageUrls;

    @NotNull
    private UUID supermarketId;

    @NotNull
    private List<ProductBatchCreate> productBatchList;

    @NotNull
    private ProductSubCategory productSubCategory;

}
