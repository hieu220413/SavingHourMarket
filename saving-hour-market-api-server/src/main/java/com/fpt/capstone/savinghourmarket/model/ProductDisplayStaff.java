package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductImage;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
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
        this.description = product.getDescription();
        this.imageUrlImageList = product.getProductImageList();
        this.status = product.getStatus();
        this.productSubCategory = product.getProductSubCategory();
        this.supermarket = product.getSupermarket();
    }

    private UUID id;

    private String name;

    private String description;


    private List<ProductImage> imageUrlImageList;

    private Integer status;

    private ProductSubCategory productSubCategory;

    private Supermarket supermarket;

    @JsonProperty("productBatchList")
    private List<ProductBatchDisplayStaff> productBatchDisplayStaffList = new ArrayList<>();
}
