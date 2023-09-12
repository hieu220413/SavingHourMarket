package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class OrderDetail {
    @Id
    @UuidGenerator
    private UUID id;

    private Integer productPrice;

    private Integer productOriginalPrice;

    private Integer boughtQuantity;

    @ManyToOne
    @JoinColumn(
            name = "order_id",
            referencedColumnName = "id"
    )
    private Order order;

    @ManyToOne
    @JoinColumn(
            name = "product_id",
            referencedColumnName = "id"
    )
    private Product product;
}
