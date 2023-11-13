package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class OrderBatch {
    @Id
    @UuidGenerator
    private UUID id;

//    private String district;

    private LocalDate deliverDate;

    @ManyToOne(
            fetch = FetchType.EAGER
    )
    @JoinColumn(
            name = "deliverer_id",
            referencedColumnName = "id"
    )
    private Staff deliverer;

    @OneToMany(
            fetch = FetchType.EAGER,
            mappedBy = "orderBatch"
    )
    private List<Order> orderList;

    @ManyToOne
    @JoinColumn(
            name = "time_frame_id",
            referencedColumnName = "id"
    )
    private TimeFrame timeFrame;

    @ManyToOne
    @JoinColumn(
            name = "product_consolidation_area_id",
            referencedColumnName = "id"
    )
    private ProductConsolidationArea productConsolidationArea;
}
