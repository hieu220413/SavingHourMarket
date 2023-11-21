package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductCategory {

    public ProductCategory(ProductCategory productCategory) {
        this.id = productCategory.getId();
        this.name = productCategory.getName();
    }

    public ProductCategory(ProductCategoryCreateBody productCategoryCreateBody) {
        this.name = productCategoryCreateBody.getName();
    }

    public ProductCategory(UUID id, String name, Long totalDiscountUsage) {
        this.id = id;
        this.name = name;
        this.totalDiscountUsage = totalDiscountUsage.intValue();
    }

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50) CHARACTER SET utf8 COLLATE utf8_bin")
    private String name;

    @OneToMany(
            mappedBy = "productCategory",
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

    @Transient
    private Integer totalDiscountUsage;

}
