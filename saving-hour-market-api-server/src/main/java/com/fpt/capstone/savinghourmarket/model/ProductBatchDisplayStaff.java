package com.fpt.capstone.savinghourmarket.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fpt.capstone.savinghourmarket.entity.ProductBatch;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductBatchDisplayStaff {
    public ProductBatchDisplayStaff(ProductBatch productBatch) {
        this.price = productBatch.getPrice();
        this.priceOriginal = productBatch.getPriceOriginal();
        this.expiredDate = productBatch.getExpiredDate();
        this.productBatchAddressDisplayStaffList =  List.of(new ProductBatchAddressDisplayStaff(productBatch)).stream().collect(Collectors.toList());
    }

    @NotNull
    private Integer price;

    @NotNull

    private Integer priceOriginal;

    @NotNull

    private LocalDate expiredDate;

    @NotNull
    @JsonProperty("productBatchAddressList")
    private List<ProductBatchAddressDisplayStaff> productBatchAddressDisplayStaffList;
}
