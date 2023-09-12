package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;
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

    private Integer rangeOfExpired;

    private Integer limitOfOrders;

    private Integer numberOfSuggestedPickupPoint;
}
