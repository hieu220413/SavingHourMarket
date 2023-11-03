package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductBatchCreate {

    private Integer price;

    private Integer priceOriginal;

    private LocalDate expiredDate;

    private Integer quantity;

    private UUID supermarketAddressId;

}
