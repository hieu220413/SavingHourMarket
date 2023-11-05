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
public class OrderDetailProductBatch {
    @Id
    @UuidGenerator
    private UUID id;

    private Integer boughtQuantity;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "order_detail_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private OrderDetail orderDetail;

    @ManyToOne
    @JoinColumn(
            name = "product_batch_id",
            referencedColumnName = "id"
    )
    private ProductBatch productBatch;
}
