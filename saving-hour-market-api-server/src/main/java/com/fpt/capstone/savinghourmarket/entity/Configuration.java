package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Validated
public class Configuration {
//
    @Id
    @UuidGenerator
    @JsonIgnore
    @Hidden
    private UUID id;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer systemStatus;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer limitOfOrders;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer numberOfSuggestedPickupPoint;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer deleteUnpaidOrderTime;

    @NotNull
    private Integer initialShippingFee;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer minKmDistanceForExtraShippingFee;

    @NotNull
    private Integer extraShippingFeePerKilometer;

    @Column(columnDefinition = "tinyint")
    @NotNull
    private Integer timeAllowedForOrderCancellation;
}
