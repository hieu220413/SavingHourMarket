package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.common.Month;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DiscountsUsageReportEachMonth {

    public DiscountsUsageReportEachMonth(Integer monthValue, Long totalDiscountUsage) {
        this.monthValue = monthValue;
        this.month = Month.getMonthNameFromNumber(monthValue);
        this.totalDiscountUsage = totalDiscountUsage;
    }

    private Integer monthValue;
    private String month;
    private Long totalDiscountUsage;
}
