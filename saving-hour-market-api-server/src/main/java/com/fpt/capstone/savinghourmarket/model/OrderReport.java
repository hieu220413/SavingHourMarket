package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
public class OrderReport {
    private Date date; // or year and month
    private Long processingCount;
    private Long packagingCount;
    private Long packagedCount;
    private Long deliveringCount;
    private Long successCount;
    private Long failCount;
    private Long cancelCount;
}
