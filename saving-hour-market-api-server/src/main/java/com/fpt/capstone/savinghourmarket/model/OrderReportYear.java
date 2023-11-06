package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderReportYear {
    private int year;
    private Long successCount;
    private Long failCount;
    private Long cancelCount;
}
