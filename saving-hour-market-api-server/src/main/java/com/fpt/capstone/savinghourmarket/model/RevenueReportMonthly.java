package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.Month;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RevenueReportMonthly {
    public RevenueReportMonthly(Integer monthValue, RevenueReportResponseBody revenue) {
        this.monthValue = monthValue;
//        this.revenue = revenue;
        this.month = Month.getMonthNameFromNumber(monthValue);
        this.totalIncome = revenue.getTotalIncome();
        this.totalPriceOriginal = revenue.getTotalPriceOriginal();
        this.totalDifferentAmount = revenue.getTotalDifferentAmount();
        this.totalSale = revenue.getTotalSale();
    }

//    public RevenueReportMonthly(Integer monthValue) {
//        this.monthValue = monthValue;
//        this.month = Month.getMonthNameFromNumber(monthValue);
////        this.revenue = new RevenueReportResponseBody();
//    }

    private Integer monthValue;
    private String month;
//    private RevenueReportResponseBody revenue;
    private Long totalIncome;
    private Long totalPriceOriginal;
    private Long totalDifferentAmount;
    private Long totalSale;
}
