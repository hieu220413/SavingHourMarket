package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderProductBatch {

    private String supermarketName;

    private String supermarketAddress;

    private Integer boughtQuantity;

    private LocalDate expiredDate;
}
