package com.fpt.capstone.savinghourmarket.model;


import com.fpt.capstone.savinghourmarket.common.Month;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaleReportSupermarketMonthlyResponseBody {
    public SaleReportSupermarketMonthlyResponseBody(Integer monthValue, Long totalSale, Long totalIncome) {
        this.monthValue = monthValue;
        this.month = Month.getMonthNameFromNumber(monthValue);
        this.totalSale = totalSale.intValue();
        this.totalIncome = totalIncome.intValue();
    }

    private Integer monthValue;
    private String month;
    private int totalSale;
    private int totalIncome;
}
