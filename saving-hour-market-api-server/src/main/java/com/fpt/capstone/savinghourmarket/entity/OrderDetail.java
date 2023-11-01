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
public class OrderDetail {
    @Id
    @UuidGenerator
    private UUID id;

    private Integer productPrice;

    private Integer productOriginalPrice;

    private Integer boughtQuantity;

    @ManyToOne()
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private Order order;

    @OneToOne
    @JoinColumn(
            name = "product_id",
            referencedColumnName = "id"
    )
    private Product product;

    @OneToMany(
            fetch = FetchType.EAGER,
            mappedBy = "orderDetail",
            cascade = CascadeType.ALL
    )
    private List<OrderDetail_ProductBatch> orderDetailProductBatches;
}
