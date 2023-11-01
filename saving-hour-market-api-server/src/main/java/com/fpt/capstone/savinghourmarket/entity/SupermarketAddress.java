package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
public class SupermarketAddress {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255)")
    private String address;

    @ManyToOne(
//            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "supermarket_id",
            referencedColumnName = "id"
    )
//    @JsonIgnore
    private Supermarket supermarket;

    @ManyToOne
    @JoinColumn(
            name = "pickup_point_id",
            referencedColumnName = "id"
    )
    private PickupPoint pickupPoint;

    public SupermarketAddress(String address, Supermarket supermarket) {
        this.address = address;
        this.supermarket = supermarket;
    }
}
