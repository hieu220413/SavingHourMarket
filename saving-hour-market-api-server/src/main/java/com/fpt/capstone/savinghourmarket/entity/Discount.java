package com.fpt.capstone.savinghourmarket.entity;

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

    @Column(columnDefinition = "varchar(255)")
    private String name;

    @Column(columnDefinition = "tinyint")
    private Integer percentage;

    private Integer spentAmountRequired;

    private LocalDateTime expiredDate;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    private Integer quantity;

    @ManyToMany(
            fetch = FetchType.LAZY
    )
    @JoinTable(
            name = "discount_product_category",
            joinColumns = @JoinColumn(name = "discount_id"),
            inverseJoinColumns = @JoinColumn(name = "product_category_id")
    )
    private List<ProductCategory> productCategoryList;


}
