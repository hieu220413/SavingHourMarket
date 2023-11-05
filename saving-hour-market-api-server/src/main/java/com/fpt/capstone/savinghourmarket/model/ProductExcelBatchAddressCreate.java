package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductExcelBatchAddressCreate {

    private Integer quantity;

    private String supermarketAddress;

}
