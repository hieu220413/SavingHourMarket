package com.fpt.capstone.savinghourmarket.model;


import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ProductDisplayCustomer {

    public ProductDisplayCustomer(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.imageUrl = product.getImageUrl();
        this.status = product.getStatus();
        this.productSubCategory = product.getProductSubCategory();
        this.supermarket = product.getSupermarket();
        this.productBatchList = new ArrayList<>();
    }

    private UUID id;

    private String name;

    private String description;


    private String imageUrl;

    private Integer status;

    private ProductSubCategory productSubCategory;

    private Supermarket supermarket;

    private List<ProductBatchDisplayCustomer> productBatchList;
}
