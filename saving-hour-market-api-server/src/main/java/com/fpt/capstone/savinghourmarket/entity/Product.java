package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Product {

//    public Product(UUID id, String name, String imageUrl, Long price, Long priceOriginal, Long quantity) {
//        this.id = id;
//        this.name = name;
////        this.imageUrl = imageUrl;
////        this.price = price.intValue();
////        this.priceOriginal = priceOriginal.intValue();
////        this.quantity = quantity.intValue();
//    }

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50) CHARACTER SET utf8 COLLATE utf8_bin")
    private String name;

//    private Integer price;
//
//    private Integer priceOriginal;

    @Column(columnDefinition = "text")
    private String description;

//    @Column(columnDefinition = "datetime(0)")
//    private LocalDate expiredDate;
//
//    private Integer quantity;

//    @Column(columnDefinition = "text")
//    private String imageUrl;

    @Column(columnDefinition = "varchar(50)")
    private String unit;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @ManyToOne
    @JoinColumn(
            name = "product_sub_category_id",
            referencedColumnName = "id"
    )
    private ProductSubCategory productSubCategory;

    @ManyToOne
    @JoinColumn(
            name = "supermarket_id",
            referencedColumnName = "id"
    )
    private Supermarket supermarket;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "product",
            cascade = CascadeType.ALL
    )
    private List<ProductBatch> productBatchList;


    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "product"
    )
    @JsonIgnore
    private List<OrderDetail> orderDetail;

    @OneToMany(
            fetch = FetchType.EAGER,
            mappedBy = "product",
            cascade = CascadeType.ALL
    )
    private List<ProductImage> productImageList;


}
