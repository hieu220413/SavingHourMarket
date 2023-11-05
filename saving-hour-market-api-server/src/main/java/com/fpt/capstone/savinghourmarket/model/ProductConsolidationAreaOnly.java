package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;

import java.util.UUID;

public interface ProductConsolidationAreaOnly {
    UUID getId();

    String getAddress();

    Integer getStatus();

    Double getLongitude();

    Double getLatitude();
}
