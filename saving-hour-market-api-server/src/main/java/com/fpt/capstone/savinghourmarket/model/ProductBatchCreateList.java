package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductBatchCreateList {

    private Integer price;

    private Integer priceOriginal;

    private LocalDate expiredDate;

    List<ProductBatchAddressCreateList> productBatchAddresses;

    public boolean hasNullField() {
        return price == null || priceOriginal == null || expiredDate == null || productBatchAddresses == null;
    }
}
