package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OrderProductForPackage {
    private String name;

    private String unit;

    private Integer boughtQuantity;

    private String description;

    private ProductSubCategory productSubCategory;

    private Supermarket supermarket;

    private OrderPackaging orderPackage;


}
