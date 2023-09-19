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
public class ProductCategory {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "varchar(50)")
    private String name;

    @ManyToMany(
            mappedBy = "productCategoryList",
            fetch = FetchType.LAZY
    )
    private List<Discount> discountList;

}
