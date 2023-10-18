package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CateWithSubCateDiscountUsageReport {
    public CateWithSubCateDiscountUsageReport() {
        this.productSubCategoryReportList = new ArrayList<>();
        this.productCategoryReport = null;
        this.totalDiscountUsage = 0;
    }

    private List<ProductSubCategory> productSubCategoryReportList;
    private ProductCategory productCategoryReport;
    private int totalDiscountUsage;
}
