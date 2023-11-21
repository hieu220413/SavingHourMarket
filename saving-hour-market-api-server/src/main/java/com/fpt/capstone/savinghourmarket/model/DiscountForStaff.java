package com.fpt.capstone.savinghourmarket.model;

import com.fpt.capstone.savinghourmarket.entity.Discount;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class DiscountForStaff {

    public DiscountForStaff(Discount discount) {
        this.id = discount.getId();
        this.name = discount.getName();
        this.percentage = discount.getPercentage();
        this.spentAmountRequired = discount.getSpentAmountRequired();
        this.expiredDate = discount.getExpiredDate();
        this.quantity = discount.getQuantity();
        this.productCategory = new ProductCategory(discount.getProductCategory());
        this.imageUrl = discount.getImageUrl();
        this.status = discount.getStatus();
    }

    private UUID id;

    private String name;

    private Integer percentage;

    private Integer spentAmountRequired;

    private LocalDateTime expiredDate;

    private Integer quantity;

    private ProductCategory productCategory;

    private String imageUrl;

    private Integer status;

}
