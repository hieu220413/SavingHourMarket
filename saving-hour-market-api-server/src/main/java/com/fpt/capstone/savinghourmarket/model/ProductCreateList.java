package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductImage;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductCreateList {

    private UUID id;

    private String name;

    private String description;

    private String unit;

    private List<String> imageUrls;

    private Supermarket supermarket;

    private List<ProductBatchCreateList> productBatchList;

    private ProductSubCategory productSubCategory;

}
