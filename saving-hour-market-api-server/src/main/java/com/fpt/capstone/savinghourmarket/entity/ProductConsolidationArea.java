package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductConsolidationArea {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @Column(columnDefinition = "decimal(23,20)")
    private Double longitude;

    @Column(columnDefinition = "decimal(22,20)")
    private Double latitude;

    @OneToMany(
            mappedBy = "productConsolidationArea",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<PickupPoint> pickupPointList;

    @OneToMany(
            mappedBy = "productConsolidationArea"
    )
    @JsonIgnore
    private List<Staff> staffList;
}
