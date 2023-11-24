package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryDiscountUsageReport {
    public CategoryDiscountUsageReport(UUID id, String name, Long totalDiscountUsage) {
        this.productCategory = new ProductCategory(id, name);
        this.totalDiscountUsage = totalDiscountUsage;
    }
    private ProductCategory productCategory;
    private Long totalDiscountUsage;
}
