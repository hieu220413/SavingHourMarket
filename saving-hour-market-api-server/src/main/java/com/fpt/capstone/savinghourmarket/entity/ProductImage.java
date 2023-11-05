package com.fpt.capstone.savinghourmarket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductImage {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(columnDefinition = "text")
    private String imageUrl;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "product_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private Product product;
}
