package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportYearly {
    public RevenueReportYearly(Integer yearValue, RevenueReportResponseBody revenueReportResponseBody) {
        this.yearValue = yearValue;
        this.totalIncome = revenueReportResponseBody.getTotalIncome();
        this.totalPriceOriginal = revenueReportResponseBody.getTotalPriceOriginal();
        this.totalDifferentAmount = revenueReportResponseBody.getTotalDifferentAmount();
        this.totalSale = revenueReportResponseBody.getTotalSale();
    }

    private Integer yearValue;
//    private RevenueReportResponseBody revenue;
    private Long totalIncome;
    private Long totalPriceOriginal;
    private Long totalDifferentAmount;
    private Long totalSale;
}
