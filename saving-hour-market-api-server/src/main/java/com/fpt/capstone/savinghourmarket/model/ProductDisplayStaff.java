package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductImage;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductDisplayStaff {

    public ProductDisplayStaff(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.unit = product.getUnit();
        this.priceListed = product.getPriceListed();
        this.description = product.getDescription();
        this.imageUrlImageList = product.getProductImageList();
        this.status = product.getStatus();
        this.productSubCategory = product.getProductSubCategory();
        this.supermarket = product.getSupermarket();
    }

    @NotNull
    private UUID id;
    @NotNull
    private String name;
    @NotNull
    private String unit;
    @NotNull
    private String description;
    @NotNull
    private Integer priceListed;
    @NotNull
    private List<ProductImage> imageUrlImageList;
    @NotNull
    private Integer status;
    @NotNull
    private ProductSubCategory productSubCategory;
    @NotNull
    private Supermarket supermarket;

    @NotNull
    @JsonProperty("productBatchList")
    private List<ProductBatchDisplayStaff> productBatchDisplayStaffList = new ArrayList<>();
}
