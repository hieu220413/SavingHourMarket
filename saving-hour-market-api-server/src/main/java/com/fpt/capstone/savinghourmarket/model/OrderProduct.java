package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderProduct {

    private UUID id;

    private Integer productPrice;

    private Integer productOriginalPrice;

    private Integer boughtQuantity;

    private String name;

    private String description;

    private LocalDateTime expiredDate;

    private String imageUrl;

    private Integer status;

    private String productSubCategory;

    private String supermarketName;
}


