package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Discount {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(255) CHARACTER SET utf8 COLLATE utf8_bin")
    private String name;

    @Column(columnDefinition = "tinyint")
    private Integer percentage;

    private Integer spentAmountRequired;

    @Column(columnDefinition = "datetime(0)")
    private LocalDateTime expiredDate;

    @Column(columnDefinition = "text")
    private String imageUrl;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    private Integer quantity;

    @ManyToMany(
            fetch = FetchType.LAZY,
            mappedBy = "discountList"
    )
    @JsonIgnore
    private List<Order> orderList;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "discount_product_category",
            joinColumns = @JoinColumn(name = "discount_id"),
            inverseJoinColumns = @JoinColumn(name = "product_category_id")
    )
    @JsonIgnore
    private List<ProductCategory> productCategoryList;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "discount_product_sub_category",
            joinColumns = @JoinColumn(name = "discount_id"),
            inverseJoinColumns = @JoinColumn(name = "product_sub_category_id")
    )
    @JsonIgnore
    private List<ProductSubCategory> productSubCategoryList;
}
