package com.fpt.capstone.savinghourmarket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PickupPointListResponseBody {
    private List<PickupPointWithProductConsolidationArea> pickupPointList;
    private int totalPage;
    private long totalPickupPoint;
}
