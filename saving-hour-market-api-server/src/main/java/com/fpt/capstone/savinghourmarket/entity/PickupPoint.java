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
public class PickupPoint {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "text")
    private String placeId;

    @Column(columnDefinition = "decimal(11,8)")
    private Float longitude;

    @Column(columnDefinition = "decimal(10,8)")
    private Float latitude;
}
