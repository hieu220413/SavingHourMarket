package com.fpt.capstone.savinghourmarket.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiscountReport {

    public DiscountReport(DiscountOnly discountOnly, Integer totalUsage) {
        this.id = discountOnly.getId();
        this.name = discountOnly.getName();
        this.percentage = discountOnly.getPercentage();
        this.imageUrl = discountOnly.getImageUrl();
        this.totalUsage = totalUsage;
    }

    private UUID id;

    private String name;

    private Integer percentage;

//    private Integer spentAmountRequired;

    private String imageUrl;

    private Integer totalUsage;
}
