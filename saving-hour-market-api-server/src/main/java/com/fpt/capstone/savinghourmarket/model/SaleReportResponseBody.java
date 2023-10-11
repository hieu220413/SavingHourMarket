package com.fpt.capstone.savinghourmarket.model;


import com.fpt.capstone.savinghourmarket.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SaleReportResponseBody {
    public SaleReportResponseBody() {
        this.productSaleReportList = new ArrayList<>();
        totalSale = 0;
        totalIncome = 0;
    }

    private List<ProductSaleReport> productSaleReportList;
    private int totalSale;
    private int totalIncome;
}
