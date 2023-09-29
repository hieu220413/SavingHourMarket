package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderProductCreate {

    private UUID id;

    private Integer productPrice;

    private Integer productOriginalPrice;

    private Integer boughtQuantity;
}
