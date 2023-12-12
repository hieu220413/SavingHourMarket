package com.fpt.capstone.savinghourmarket.model;


import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductImage;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ProductDisplayCustomer {

    public ProductDisplayCustomer(LocalDate nearestBatchExpiredDate, Integer nearestBatchPrice, Integer nearestBatchPriceOriginal, Product product) {
        this.id = product.getId();
        this.name = product.getName() + " (" + product.getSupermarket().getName() + ")";
        this.description = product.getDescription();
        this.imageUrlImageList = product.getProductImageList();
        this.status = product.getStatus();
        this.priceListed = product.getPriceListed();
        this.unit = product.getUnit();
        this.productSubCategory = product.getProductSubCategory();
        this.supermarket = product.getSupermarket();
        this.otherProductBatchList = new ArrayList<>();
        this.nearestExpiredBatch = new ProductBatchDisplayCustomer(nearestBatchExpiredDate, nearestBatchPrice, nearestBatchPriceOriginal);
    }


//    public ProductDisplayCustomer(ProductBatch productBatch) {
//        this.id = productBatch.getProduct().getId();
//        this.name = productBatch.getProduct().getName();
//        this.description = productBatch.getProduct().getDescription();
//        this.imageUrl = productBatch.getProduct().getImageUrl();
//        this.status = productBatch.getProduct().getStatus();
//        this.productSubCategory = productBatch.getProduct().getProductSubCategory();
//        this.supermarket = productBatch.getProduct().getSupermarket();
//        this.nearestExpiredBatch = new ProductBatchDisplayCustomer(productBatch);
//    }

    private UUID id;

    private String name;

    private String description;

    private String unit;

    private Integer priceListed;

    private List<ProductImage> imageUrlImageList;

    private Integer status;

    private ProductSubCategory productSubCategory;

    private Integer fromPriceRange;
    private Integer toPriceRange;

    private Supermarket supermarket;

    private ProductBatchDisplayCustomer nearestExpiredBatch;

    private List<ProductBatchDisplayCustomer> otherProductBatchList = new ArrayList<>();
}
