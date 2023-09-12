package com.fpt.capstone.savinghourmarket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Product {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String name;

    private Integer price;

    private Integer priceOriginal;

    @Column(columnDefinition = "text")
    private String description;

    private LocalDateTime expiredDate;

    private Integer quantity;

    @Column(columnDefinition = "text")
    private String imageUrl;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @ManyToOne
    @JoinColumn(
            name = "product_category_id",
            referencedColumnName = "id"
    )
    private ProductCategory productCategory;

    @ManyToOne
    @JoinColumn(
            name = "supermarket_id",
            referencedColumnName = "id"
    )
    private Supermarket supermarket;
}
