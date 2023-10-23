package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Configuration {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "tinyint")
    private Integer systemStatus;

    @Column(columnDefinition = "tinyint")
    private Integer limitOfOrders;

    @Column(columnDefinition = "tinyint")
    private Integer numberOfSuggestedPickupPoint;

    @Column(columnDefinition = "tinyint")
    private Integer deleteUnpaidOrderTime;

    private Integer initialShippingFee;

    @Column(columnDefinition = "tinyint")
    private Integer minKmDistanceForExtraShippingFee;

    private Integer extraShippingFeePerKilometer;
}
