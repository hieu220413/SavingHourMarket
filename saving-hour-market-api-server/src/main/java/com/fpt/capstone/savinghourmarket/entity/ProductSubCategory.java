package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fpt.capstone.savinghourmarket.model.ProductSubCategoryCreateBody;
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
public class ProductSubCategory {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50) CHARACTER SET utf8 COLLATE utf8_bin")
    private String name;

    @Column(columnDefinition = "text")
    private String imageUrl;

    @Column(columnDefinition = "tinyint")
    private Integer allowableDisplayThreshold;

    @Column(columnDefinition = "tinyint")
    private Integer status;

    @OneToMany(
            mappedBy = "productSubCategory",
            fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Product> productList;

    @ManyToOne(
            fetch = FetchType.EAGER
    )
    @JoinColumn(
            name = "product_category_id",
            referencedColumnName = "id"
    )
    private ProductCategory productCategory;

//    @OneToMany(
//            mappedBy = "productSubCategory",
//            fetch = FetchType.LAZY
//    )
//    @JsonIgnore
//    private List<Discount> discountList;

    public ProductSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody) {
        this.id = productSubCategoryCreateBody.getProductCategoryId();
        this.name = productSubCategoryCreateBody.getName();
        this.imageUrl = productSubCategoryCreateBody.getImageUrl();
        this.allowableDisplayThreshold = productSubCategoryCreateBody.getAllowableDisplayThreshold();

    }

    @Transient
    private Integer totalDiscountUsage;

    public ProductSubCategory(UUID id, String name, String imageUrl, Integer allowableDisplayThreshold, Long totalDiscountUsage) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.allowableDisplayThreshold = allowableDisplayThreshold;
        this.totalDiscountUsage = totalDiscountUsage.intValue();
    }

    public ProductSubCategory(UUID id, String name, String imageUrl, Integer allowableDisplayThreshold) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.allowableDisplayThreshold = allowableDisplayThreshold;
    }
}
