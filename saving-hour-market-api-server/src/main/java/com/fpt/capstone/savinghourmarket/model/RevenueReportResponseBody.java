package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportResponseBody {
    public RevenueReportResponseBody(Long totalIncome, Long totalInvestment, Long totalSale) {
        this.totalIncome = totalIncome != null ? totalIncome : 0;
        this.totalPriceOriginal = totalInvestment != null ? totalInvestment : 0;
        this.totalSale = totalSale != null ? totalSale : 0;
        this.totalDifferentAmount = this.totalIncome - this.totalPriceOriginal;
    }

    private Long totalIncome;
    private Long totalPriceOriginal;
    private Long totalDifferentAmount;
    private Long totalSale;
}
