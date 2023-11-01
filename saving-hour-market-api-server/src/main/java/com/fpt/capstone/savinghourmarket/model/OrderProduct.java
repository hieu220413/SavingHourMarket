package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.OrderDetailProductBatch;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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

    private String imageUrl;

    private Integer status;

    private String productCategory;

    private String productSubCategory;

    private List<OrderProductBatch> orderDetailProductBatches;
}


