package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductConsolidationArea;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OrderProductForPackage {
    private String name;

    private String unit;

    private LocalDate expiredDate;

    private List<String> imageUrlImageList;

    private Integer boughtQuantity;

    private Supermarket supermarket;

    private SupermarketAddress supermarketAddress;

    private OrderPackaging orderPackage;

    private ProductConsolidationArea productConsolidationArea;


}
