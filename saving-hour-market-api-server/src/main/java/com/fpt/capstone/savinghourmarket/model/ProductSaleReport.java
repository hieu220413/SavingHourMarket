package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSaleReport {

    public ProductSaleReport(Product product,Integer totalIncome, Integer soldQuantity) {
        this.id = product.getId();
        this.name = product.getName();
        this.imageUrl = product.getImageUrl();
        this.totalIncome = totalIncome;
//        this.totalPriceOriginal = product.getPriceOriginal();
        this.soldQuantity = soldQuantity;
    }

    private UUID id;
    private String name;
    private String imageUrl;
    private Integer totalIncome;
//    private Integer totalPriceOriginal;
    private Integer soldQuantity;
}
