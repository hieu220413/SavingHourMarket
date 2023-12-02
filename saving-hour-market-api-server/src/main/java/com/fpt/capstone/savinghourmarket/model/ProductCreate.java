package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
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
    private Integer priceListed;

    @NotNull
    private List<String> imageUrls;

    @NotNull
    private UUID supermarketId;

    @NotNull
    private List<ProductBatchRequest> productBatchList;

    @NotNull
    private ProductSubCategory productSubCategory;

}
