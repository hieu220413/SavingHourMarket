package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CateOderQuantityResponseBody {
    public CateOderQuantityResponseBody(ProductCategory productCategory) {
        this.categoryId = productCategory.getId();
        this.categoryName = productCategory.getName();
    }

    public CateOderQuantityResponseBody(UUID categoryId, String categoryName, Long totalOrderQuantity) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.totalOrderQuantity = totalOrderQuantity == null ? 0 : totalOrderQuantity.intValue();
    }

    private UUID categoryId;

    private String categoryName;
    private Integer totalOrderQuantity;
}
