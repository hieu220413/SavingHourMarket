package com.fpt.capstone.savinghourmarket.model;

import java.util.List;
import java.util.UUID;

public interface PickupPointWithProductConsolidationArea {
    UUID getId();

    String getAddress();

    Integer getStatus();

    Double getLongitude();

    Double getLatitude();

    List<ProductConsolidationAreaOnly> getProductConsolidationAreaList();
}
