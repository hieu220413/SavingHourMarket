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
        this.idList = new ArrayList<>();
        this.idList.add(productBatch.getId());
        this.price = productBatch.getPrice();
        this.priceOriginal = productBatch.getPriceOriginal();
        this.expiredDate = productBatch.getExpiredDate();
        this.quantity = productBatch.getQuantity();
    }

    private List<UUID> idList;

    private Integer price;

    private Integer priceOriginal;

    private LocalDate expiredDate;

    private Integer quantity;

}
