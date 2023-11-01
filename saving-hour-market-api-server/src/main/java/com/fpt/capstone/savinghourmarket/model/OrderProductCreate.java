package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.SupermarketAddress;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderProductCreate {

    private UUID productId;

    private Integer productPrice;

    private Integer productOriginalPrice;

    private Integer boughtQuantity;

    private List<UUID> productBatchIds;
}
