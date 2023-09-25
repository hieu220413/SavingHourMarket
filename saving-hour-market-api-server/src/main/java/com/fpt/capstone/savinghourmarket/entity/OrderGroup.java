package com.fpt.capstone.savinghourmarket.entity;

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
@Table(name = "order_group")
public class OrderGroup {
    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(
            name = "time_frame_id",
            referencedColumnName = "id"
    )
    private TimeFrame timeFrame;

    @ManyToOne
    @JoinColumn(
            name = "pickup_point_id",
            referencedColumnName = "id"
    )
    private PickupPoint pickupPoint;

    @OneToMany(
            mappedBy = "orderGroup"
    )
    private List<Order> orderList;
}
