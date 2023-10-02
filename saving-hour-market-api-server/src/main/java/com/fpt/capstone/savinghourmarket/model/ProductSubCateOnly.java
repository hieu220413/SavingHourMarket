package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;

import java.util.UUID;

public interface ProductSubCateOnly {
    UUID getId();

    String getName();

    Integer getAllowableDisplayThreshold();
}
