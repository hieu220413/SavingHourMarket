package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductBatchAddressDisplayStaff {

    public ProductBatchAddressDisplayStaff(ProductBatch productBatch) {
        this.productBatchId = productBatch.getId();
        this.quantity = productBatch.getQuantity();
        this.supermarketAddress = productBatch.getSupermarketAddress();
    }

    @NotNull
    private UUID productBatchId;

    @NotNull
    private Integer quantity;

    @NotNull
    private SupermarketAddress supermarketAddress;
}
