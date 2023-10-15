package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpt.capstone.savinghourmarket.model.ProductCategoryCreateBody;
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
public class ProductCategory {

    public ProductCategory(ProductCategoryCreateBody productCategoryCreateBody) {
        this.name = productCategoryCreateBody.getName();
    }

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String name;

    @ManyToMany(
            mappedBy = "productCategoryList",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Discount> discountList;

    @OneToMany(
            mappedBy = "productCategory",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<ProductSubCategory> productSubCategories;

}
