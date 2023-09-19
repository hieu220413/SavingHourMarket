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
public class ProductSubCategory {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String name;

    @Column(columnDefinition = "tinyint")
    private Integer allowableDisplayThreshold;

    @OneToMany(
            mappedBy = "productSubCategory",
            fetch = FetchType.LAZY
    )
    private List<Product> productList;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "product_category_id",
            referencedColumnName = "id"
    )
    private ProductCategory productCategory;

    @ManyToMany(
            mappedBy = "productSubCategoryList",
            fetch = FetchType.LAZY
    )
    private List<Discount> discountList;

}
