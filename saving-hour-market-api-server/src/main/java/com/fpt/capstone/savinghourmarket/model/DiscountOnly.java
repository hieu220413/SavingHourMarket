package com.fpt.capstone.savinghourmarket.model;

import java.time.LocalDateTime;
import java.util.UUID;

public interface DiscountOnly {

    UUID getId();

    String getName();

    Integer getPercentage();

    Integer getSpentAmountRequired();

    LocalDateTime getExpiredDate();

    Integer getStatus();

    Integer getQuantity();

}
