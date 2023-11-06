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

    public ProductSaleReport(UUID id, String name, String supermarketName) {
        this.id = id;
        this.name = name;
        this.supermarketName = supermarketName;
        this.totalIncome = Long.parseLong("0");
        this.soldQuantity = 0;
    }

    private UUID id;
    private String name;
    private String supermarketName;
    private Long totalIncome;
    private Integer soldQuantity;
}
