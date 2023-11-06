package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductBatchDisplayCustomer {

    public ProductBatchDisplayCustomer(ProductBatch productBatch) {
        this.idList.add(productBatch.getId());
        this.price = productBatch.getPrice();
        this.priceOriginal = productBatch.getPriceOriginal();
        this.expiredDate = productBatch.getExpiredDate();
        this.quantity = productBatch.getQuantity();
    }

    public ProductBatchDisplayCustomer(LocalDate nearestBatchExpiredDate, Integer nearestBatchPrice, Integer nearestBatchPriceOriginal) {
        this.price = nearestBatchPrice;
        this.priceOriginal = nearestBatchPriceOriginal;
        this.expiredDate = nearestBatchExpiredDate;
        this.quantity = 0;
    }

    private List<UUID> idList = new ArrayList<>();

    private Integer price;

    private Integer priceOriginal;

    private LocalDate expiredDate;

    private Integer quantity;


}
