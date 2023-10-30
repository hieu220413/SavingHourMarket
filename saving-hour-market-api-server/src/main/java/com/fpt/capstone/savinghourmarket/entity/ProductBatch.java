package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductBatch {

    @Id
    @UuidGenerator
    private UUID id;

    private Integer price;

    private Integer priceOriginal;

    @Column(columnDefinition = "datetime(0)")
    private LocalDate expiredDate;

    private Integer quantity;

//    @Column(columnDefinition = "tinyint")
//    private Integer status;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "product_id",
            referencedColumnName = "id"
    )
    private Product product;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "supermarket_address_id",
            referencedColumnName = "id"
    )
    private SupermarketAddress supermarketAddress;
}
