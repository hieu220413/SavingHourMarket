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

    private Integer priceListed;

    private String unit;

    private List<String> imageUrls;

    private Supermarket supermarket;

    private List<ProductBatchCreateList> productBatchList;

    private ProductSubCategory productSubCategory;

    @Override
    public String toString() {
        return
                "name='" + name + '\'' +
                        ", description='" + description + '\'' +
                        ", priceListed=" + priceListed +
                        ", unit='" + unit + '\'' +
                        ", imageUrls=" + imageUrls +
                        ", supermarket=" + supermarket;
    }
}
